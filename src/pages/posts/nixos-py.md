---
title: "Python on NixOS"
description: "Using nix shell to make python useable on NixOS"
date: 2025-04-20
tags: ["linux", "nixos", "python"]
layout: ../../layouts/BlogLayout.astro
---

# Python on NixOS: A Guide for the Challenged


## Introduction

Everyone and their mother uses NixOS now (Firebase and Railway too). You too wanna get to work and stack some paper since you spent your savings on that akasupa to the graduated VTuber(s) who you were parasocial for. So, you quickly install Python from the nixpkgs and then make your first import. The terminal shits out import errors from locations you never imagined existed on your system. WHAT THE HELL IS A NIX STORE!!! For the nix-tards like me, I wanna help you guys save some time.

Let's go with the simplest way I know (the non-Nix route) and let's set up a reproducible Python environment using Nix, uv. You’ll finally be able to run your code and hopefully get your money up and not your funny up.

My fella, do you need the method?

![vegeta](/src/assets/blog/nixos-py/method.webp)
<!-- <div class="image-caption">do you need the method?</div> -->


## Prerequisites

- NixOS installed (socially inept simulator)
- Your project *should* have a `requirements.txt`, and your Python source files (tf you doing here if you don’t).

## Step 0: Create a `shell.nix` File

Create a `shell.nix` file in your project directory with the following content:
```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {

  packages = [
    pkgs.python310 # or whatever version you use
    pkgs.uv
    pkgs.stdenv.cc.cc
  ];

  env.LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
    # these are the most common
    pkgs.stdenv.cc.cc.lib
    pkgs.libz
  ];

}
```

## Step 1: Enter the Nix Shell



![nix-shell](/src/assets/blog/nixos-py/py1.webp)
<div class="image-caption">nix-shell</div>

Open your terminal in the project directory and type:

```sh
nix-shell
```

This loads a reproducible shell with Python and uv, as dictated by your `shell.nix`. If it fails, honestly, you are cooked.



## Step 2: Create and Activate a Virtual Environment

![uv venv](/src/assets/blog/nixos-py/py2.webp)
<div class="image-caption">venv time</div>

Let uv cook:

```sh
uv venv
source .venv/bin/activate
```

If your prompt doesn’t change, it’s either working or it's not (my zsh config is dogshit).



## Step 3: Initialize the Project (Optional)

If you are chatgpt-ing the shit outta your projcet, you might get prompted to generate a `pyproject.toml`:

```sh
uv init
```

So much for industry practices. 


## Step 4: Install Dependencies


![uv add](/src/assets/blog/nixos-py/py3.webp)
<div class="image-caption">uv doing its magic</div>


Time to summon your packages:

```sh
uv add -r requirements.txt
```

This will (hopefully) resolve and install everything. If it doesn’t, check your `requirements.txt` for typos, or find the nix-tards on reddit.



## Step 5: Run Your Python Application

![seikai](/src/assets/blog/nixos-py/py4.webp)
<div class="image-caption">app runs hopefully</div>

Cross your heart and run the code:

```sh
uv run app.py
```

Or, if you’re feeling retro:

```sh
python app.py
```

Or if you just want to see something work:

```sh
python main.py
```



## Example Output

If you’re running a Flask app, you should see:

```
* Serving Flask app 'app'
* Debug mode: off
* Running on http://127.0.0.1:5000
```

If you’re running a basic script:

```
Hello from flask-app!
```



## Troubleshooting

- Make sure you’re in the nix-shell and virtual environment before installing or running code. Otherwise, you’re just yelling at the clouds.
- If dependencies fail to install, check your `requirements.txt` and Python version. Or try turning it off and on again (the computer, not your brain).
- Still broken? Blame Python packaging. Everyone else does.



Congrats! You’ve now set up Python with external packages on NixOS (or whatever flavor of Linux you’re torturing yourself with). Go forth and break something new!
