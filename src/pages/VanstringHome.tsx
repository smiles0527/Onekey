import React from 'react';
import { Link } from 'react-router-dom';

const VanstringHome: React.FC = () => (
  <div className="min-h-screen bg-stone-900 text-white">
    <section className="relative overflow-hidden pt-[4.5rem]">
      <div className="relative h-[44vw] min-h-[420px] max-h-[calc(100vh-4.5rem)] overflow-hidden">
        <img
          src={`${process.env.PUBLIC_URL}/pics/vanstring.jpg`}
          alt="Vanstring orchestra performing on stage"
          className="absolute inset-0 h-full w-full object-contain object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/82 to-stone-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-950/70" />

        <div className="container relative z-10 mx-auto flex h-full items-center justify-start px-6 pb-10 pt-8 text-left md:pt-12">
          <div className="max-w-2xl">
            <span className="mb-5 block h-px w-16 bg-indigo-400" aria-hidden="true" />
            <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
              About Vanstring
            </h1>
            <p className="mt-8 text-lg font-light leading-8 text-stone-300 md:text-xl md:leading-9">
              Vanstring is OneKey&apos;s student-led string ensemble, created to
              bring live music into senior homes and community spaces. Through
              weekly chamber performances and collaborative rehearsals, students
              share their passion of classical music while building confidence,
              leadership, and connection.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="container relative z-20 mx-auto -mt-16 px-6 pb-16 pt-0 md:-mt-20 md:pb-20">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        <Link
          to="/team"
          className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-stone-800/45 shadow-xl shadow-black/10 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-300/35 hover:bg-stone-800/70 hover:shadow-2xl hover:shadow-black/25"
        >
          <div className="aspect-[16/9] border-b border-indigo-300/20 bg-stone-900/55 p-3 transition-all duration-300 ease-out hover:border-indigo-300/45 hover:bg-stone-900/75">
            <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
              <img
                src={`${process.env.PUBLIC_URL}/pics/vanstring_team.jpg`}
                alt="Vanstring students performing on cello"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold text-white">
              Our Team
            </h2>
            <p className="mt-4 text-base font-light leading-7 text-stone-300">
              Meet the students who allowed us to maintain our collective goal of sharing music and help keep Vanstring running.
            </p>
          </div>
        </Link>

        <Link
          to="/timeline"
          className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-stone-800/45 shadow-xl shadow-black/10 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-300/35 hover:bg-stone-800/70 hover:shadow-2xl hover:shadow-black/25"
        >
          <div className="aspect-[16/9] border-b border-indigo-300/20 bg-stone-900/55 p-3 transition-all duration-300 ease-out hover:border-indigo-300/45 hover:bg-stone-900/75">
            <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
              <img
                src={`${process.env.PUBLIC_URL}/pics/vanstring_history.jpg`}
                alt="Vanstring orchestra performing in a concert hall"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold text-white">
              Our History
            </h2>
            <p className="mt-4 text-base font-light leading-7 text-stone-300">
              Founded in 2007, our 19 years of Vanstring history represents our unwavering dedication to the arts, and giving to others.
            </p>
          </div>
        </Link>
      </div>

      <div className="mx-auto mt-16 max-w-6xl md:mt-20">
        <span className="mb-5 block h-px w-16 bg-indigo-400" aria-hidden="true" />
        <h2 className="font-display text-3xl font-semibold text-white md:text-5xl">
          Current Members
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              src: 'vanstring_member_1.jpg',
              alt: 'Current Vanstring members performing for a senior community',
            },
            {
              src: 'vanstring_member_2.jpg',
              alt: 'Current Vanstring members playing chamber music',
            },
            {
              src: 'vanstring_member_3.jpg',
              alt: 'Current Vanstring members posing with instruments',
            },
          ].map(memberPhoto => (
            <div
              key={memberPhoto.src}
              className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-stone-800/45 p-3 shadow-xl shadow-black/10"
            >
              <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
                <img
                  src={`${process.env.PUBLIC_URL}/pics/${memberPhoto.src}`}
                  alt={memberPhoto.alt}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              section: 'Violin 1',
              members: [
                'Curtis',
                'Gabby',
                'Rachel',
                'Charles',
                'Aliya',
                'Eric',
                'Anne',
                'Emma',
                'Ethan',
                'Annie',
                'Portia',
                'Andy',
                'Charlotte',
              ],
            },
            {
              section: 'Violin 2',
              members: [
                'Alex',
                'Victoria',
                'Lina',
                'Claudia',
                'Maggie',
                'Ella',
                'Didi',
                'Dora',
                'Jason',
                'Maggie',
                'Shirley',
              ],
            },
            {
              section: 'Violin 3',
              members: [
                'Jessica',
                'Veronica',
                'Lucas',
                'Aiden',
                'Ethan',
                'Ole',
                'Matthew',
                'Jeffery',
                'Cloe',
                'Zachary',
                'Ariana',
                'Annie',
                'Stephen',
                'Joy',
              ],
            },
            {
              section: 'Cello',
              members: [
                'Dinno',
                'Melanie',
                'Johnny',
                'Sophie',
                'Ellen',
                'Annabelle',
                'Ryan',
                'Allen',
                'Stacy',
              ],
            },
          ].map(group => (
            <div
              key={group.section}
              className="rounded-2xl border border-white/10 bg-stone-800/45 p-6 shadow-xl shadow-black/10"
            >
              <h3 className="font-display text-xl font-semibold text-white">
                {group.section}
              </h3>
              <ul className="mt-4 space-y-2 text-sm font-light leading-6 text-stone-300">
                {group.members.map((member, index) => (
                  <li key={`${group.section}-${member}-${index}`}>
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default VanstringHome;
