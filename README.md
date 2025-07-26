# Onekey Website
##Raspberry Pi installation:
First, let's install the github cli tool.
```
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

After, you can check your gh version using 
```
gh --version
```
and then authenticate your account using 
```
gh auth login
```
After the setup, run 
```
gh repo clone smiles0527/Onekey
```
to clone this repository. 
