import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTeamStore } from '../../store/teamStore';
import { useTimelineStore } from '../../store/timelineStore';

type LineType = 'input' | 'output' | 'success' | 'error' | 'info' | 'header' | 'dim' | 'warn';

interface Line {
  id: number;
  text: string;
  type: LineType;
  prompt?: string;
}

let _id = 0;
const line = (text: string, type: LineType = 'output', prompt?: string): Line =>
  ({ id: _id++, text, type, prompt });

const BANNER: Line[] = [
  line('┌─────────────────────────────────────────────┐', 'dim'),
  line('│  OneKey Admin Terminal  v1.0                │', 'info'),
  line('│  type "help" for available commands         │', 'dim'),
  line('└─────────────────────────────────────────────┘', 'dim'),
  line('', 'output'),
];

const HELP: Line[] = [
  line('COMMANDS', 'header'),
  line('  ls users [role]           list users (role: admin|user|super_admin)', 'output'),
  line('  ls team [section]         list team members', 'output'),
  line('  ls events                 list timeline events', 'output'),
  line('  set role <email> <role>   change user role (admin|user)', 'output'),
  line('  hide <name>              hide team member from site', 'output'),
  line('  show <name>              unhide team member', 'output'),
  line('  delete team <name>       delete team member (asks confirm)', 'output'),
  line('  reload                   refresh all data from Firestore', 'output'),
  line('  whoami                   show current session', 'output'),
  line('  clear                    clear terminal output', 'output'),
  line('', 'output'),
];

const AdminTerminal: React.FC = () => {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [pendingConfirm, setPendingConfirm] = useState<null | { message: string; onYes: () => void }>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollBottom = () => {
    setTimeout(() => {
      if (outputRef.current)
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }, 20);
  };

  useEffect(() => { scrollBottom(); }, [lines]);

  const push = useCallback((...newLines: Line[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const execute = useCallback(async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    // Handle confirmation prompt
    if (pendingConfirm) {
      setPendingConfirm(null);
      const answer = cmd.toLowerCase();
      push(line(`${answer}`, 'input'));
      if (answer === 'y' || answer === 'yes') {
        pendingConfirm.onYes();
      } else {
        push(line('cancelled.', 'warn'));
      }
      return;
    }

    push(line(cmd, 'input'));
    setCmdHistory(h => [cmd, ...h.slice(0, 49)]);
    setHistIdx(-1);

    const parts = cmd.split(/\s+/);
    const verb = parts[0].toLowerCase();

    if (verb === 'clear') {
      setLines(BANNER);
      return;
    }

    if (verb === 'help') { push(...HELP); return; }

    if (verb === 'whoami') {
      const u = useAuthStore.getState().user;
      if (!u) { push(line('not authenticated', 'error')); return; }
      push(
        line(`email  : ${u.email}`, 'output'),
        line(`role   : ${u.role}`, 'output'),
        line(`id     : ${u.id}`, 'dim'),
      );
      return;
    }

    if (verb === 'reload') {
      push(line('fetching…', 'dim'));
      await Promise.all([
        useAuthStore.getState().fetchUsers(),
        useTeamStore.getState().fetchTeamMembers(),
        useTimelineStore.getState().fetchEvents(),
      ]);
      push(line('✓ data refreshed', 'success'));
      return;
    }

    if (verb === 'ls') {
      const sub = parts[1]?.toLowerCase();

      if (sub === 'users') {
        const { users } = useAuthStore.getState();
        const filter = parts[2];
        const list = filter ? users.filter(u => u.role === filter) : users;
        if (!list.length) { push(line('no users found', 'warn')); return; }
        push(
          line('', 'output'),
          line(`${'EMAIL'.padEnd(36)}${'ROLE'.padEnd(14)}STATUS`, 'header'),
          line('─'.repeat(64), 'dim'),
          ...list.map(u =>
            line(
              `${u.email.padEnd(36)}${u.role.padEnd(14)}${u.isActive ? 'active' : 'inactive'}`,
              u.isActive ? 'output' : 'dim',
            )
          ),
          line('', 'output'),
        );
        return;
      }

      if (sub === 'team') {
        const { teamMembers } = useTeamStore.getState();
        const section = parts[2];
        const list = section ? teamMembers.filter(m => m.section === section) : teamMembers;
        if (!list.length) { push(line('no members found', 'warn')); return; }
        push(
          line('', 'output'),
          line(`${'NAME'.padEnd(26)}${'SECTION'.padEnd(16)}${'VISIBLE'.padEnd(10)}ROLE`, 'header'),
          line('─'.repeat(72), 'dim'),
          ...list.map(m =>
            line(
              `${m.name.padEnd(26)}${m.section.padEnd(16)}${(m.isActive ? 'yes' : 'no').padEnd(10)}${m.role}`,
              m.isActive ? 'output' : 'dim',
            )
          ),
          line('', 'output'),
        );
        return;
      }

      if (sub === 'events') {
        const { events } = useTimelineStore.getState();
        if (!events.length) { push(line('no events found', 'warn')); return; }
        push(
          line('', 'output'),
          line(`${'DATE'.padEnd(14)}${'CATEGORY'.padEnd(16)}NAME`, 'header'),
          line('─'.repeat(60), 'dim'),
          ...events.map(e =>
            line(`${e.date.slice(0, 10).padEnd(14)}${e.category.padEnd(16)}${e.name}`, 'output')
          ),
          line('', 'output'),
        );
        return;
      }

      push(line(`unknown: ls ${sub ?? ''}. try: ls users | ls team | ls events`, 'error'));
      return;
    }

    if (verb === 'set') {
      if (parts[1] === 'role') {
        const email = parts[2];
        const role = parts[3];
        if (!email || !role) { push(line('usage: set role <email> <admin|user>', 'error')); return; }
        if (!['admin', 'user'].includes(role)) { push(line('role must be admin or user', 'error')); return; }
        const { users, updateUserRole } = useAuthStore.getState();
        const target = users.find(u => u.email === email);
        if (!target) { push(line(`user not found: ${email}`, 'error')); return; }
        push(line(`setting ${email} → ${role}…`, 'dim'));
        const ok = await updateUserRole(target.id, role);
        push(ok
          ? line(`✓ ${email} is now ${role}`, 'success')
          : line(`failed: ${useAuthStore.getState().error}`, 'error')
        );
        return;
      }
      push(line(`unknown: set ${parts[1] ?? ''}`, 'error'));
      return;
    }

    if (verb === 'hide' || verb === 'show') {
      const query = parts.slice(1).join(' ').toLowerCase();
      if (!query) { push(line(`usage: ${verb} <name>`, 'error')); return; }
      const { teamMembers, updateTeamMember } = useTeamStore.getState();
      const match = teamMembers.find(m => m.name.toLowerCase().includes(query));
      if (!match) { push(line(`no member matching: ${query}`, 'error')); return; }
      const active = verb === 'show';
      await updateTeamMember(match.id, { isActive: active });
      push(line(`✓ ${match.name} → ${active ? 'visible' : 'hidden'}`, 'success'));
      return;
    }

    if (verb === 'delete' && parts[1] === 'team') {
      const query = parts.slice(2).join(' ').toLowerCase();
      if (!query) { push(line('usage: delete team <name>', 'error')); return; }
      const { teamMembers, removeTeamMember } = useTeamStore.getState();
      const match = teamMembers.find(m => m.name.toLowerCase().includes(query));
      if (!match) { push(line(`no member matching: ${query}`, 'error')); return; }
      push(line(`delete "${match.name}"? (y/n)`, 'warn'));
      setPendingConfirm({
        message: `delete "${match.name}"? (y/n)`,
        onYes: async () => {
          await removeTeamMember(match.id);
          push(line(`✓ deleted ${match.name}`, 'success'));
        },
      });
      return;
    }

    push(line(`command not found: ${verb}`, 'error'), line('type "help" for commands', 'dim'));
  }, [pendingConfirm, push]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = input;
      setInput('');
      execute(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? '' : cmdHistory[next] ?? '');
    }
  };

  const promptLabel = pendingConfirm ? '(y/n) > ' : 'admin@onekey ❯ ';

  return (
    <div className="admin-terminal" onClick={() => inputRef.current?.focus()}>
      <div className="admin-terminal__bar">
        <span className="admin-terminal__dot" />
        <span className="admin-terminal__dot" />
        <span className="admin-terminal__dot" />
        <span className="admin-terminal__bar-title">admin terminal — onekey</span>
      </div>

      <div className="admin-terminal__output" ref={outputRef}>
        {lines.map(l => (
          <div key={l.id} className={`admin-terminal__line admin-terminal__line--${l.type}`}>
            {l.type === 'input' && (
              <span className="admin-terminal__prompt-span">admin@onekey ❯ </span>
            )}
            {l.text}
          </div>
        ))}
      </div>

      <div className="admin-terminal__input-row">
        <span className="admin-terminal__prompt-label">{promptLabel}</span>
        <input
          ref={inputRef}
          className="admin-terminal__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default AdminTerminal;
