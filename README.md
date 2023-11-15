# CS2 RCON UI

A simple userinterface to interact with a cs2 server via rcon. 
It provides autocompletion by executing `find` on the server. 
Input your command and use <kbd>Tab</kbd> to open the autocompletion dialog.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/screen-dark.png">
  <img src="./docs/screen-light.png">
</picture>

## Usage

```yml
version: '3.7'

services:
  rcon:
    image: ghcr.io/janstuemmel/cs2-rcon
    environment:
      HOST: my-server.com
      PORT: 27015
      RCON_PASS: my-s3cret
    ports:
      - "3000:3000"
```