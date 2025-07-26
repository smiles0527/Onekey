# Onekey Website
## Raspberry Pi installation:
First, let's install the GitHub CLI tool.
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

After, you can check your gh version using:
```bash
gh --version
```

And then authenticate your account using:
```bash
gh auth login
```

After the setup, run:
```bash
gh repo clone smiles0527/Onekey
```
to clone this repository.

---

### Installation of NodeJS on a Raspberry Pi

First, run:
```bash
sudo apt install -y ca-certificates curl gnupg
```

Then:
```bash
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/nodesource.gpg
```

Use the correct Node.js major version (e.g. 20):
```bash
NODE_MAJOR=20
```

Next, run:
```bash
echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x bookworm main" | sudo tee /etc/apt/sources.list.d/nodesource.list
```

To update our package lists, run:
```bash
sudo apt update
```

And finally:
```bash
sudo apt install -y nodejs
```



