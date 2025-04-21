---
title: "Zen Browser on NixOS"
description: "Installing Zen Browser using a flake on NixOS"
date: 2024-11-15
tags: ["linux", "nixos", "configuration"]
layout: ../../layouts/BlogLayout.astro
---

# Installing Zen Browser on NixOS ❄️

**quiet**



## Introduction

We all know Linux users. We either spend the rest of our lives wasting away on Debian or take the redpill and jump into more adventurous distros like Arch and Gentoo. I am the latter. Spending days trying to figure out what broke my Arch distro while dealing with work deadlines and grad school projects, I am convinced that I am a masochistic autist. But lately, I felt Arch has been a bit too stable for me. My last install broke due to a user error where I installed an incompatible kernel and my initramfs was confused. This won’t do! So of course, I did what most normal people would do. I bought a used ThinkPad T480s from eBay for a measly $90 to dip my toes into the “new Arch” distro, NixOS!



## NixOS, flakes and home-manager

![NixChan from assets](/cutesite/assets/blog/nixos-zen/nixchan.webp)
<div class="image-caption">nixchan is the unofficial NixOS mascot</div>

NixOS is truly amazingly mind-boggling. When I learnt that this was Eelco Dolstra’s PhD thesis on “correct software deployment”, this simultaneously intrigued me and made me have an existential crisis (whenever I see someone my age be incredibly talented, it bums me tf out). NixOS is lauded for its modularity, reproducibility and something else I can not remember, nor can I be bothered to look up.

If you want a quick NixOS setup and you don't want to bother watching dozens of hours of Vimoyer’s NixOS videos, be sure to check out Fernando Borretti’s quick install guide!

If you have looked up info on Nix, you probably know you could imperatively install anything on Nix just like on Arch:

```sh
nix-shell -p <package name>
```

which is basically the NixOS counterpart of Arch’s incredibly convenient

```sh
sudo pacman -S <package name>
```

But we are on NixOS! We want to do stuff the Nix way! We want to declaratively install packages! Even if they don’t exist in the official NixOS package repo!

Let’s proceed to what is really important. Nix is a very versatile language; no two configs will be similar! It is very important to understand the basics of the language to efficiently write your configs. This can take weeks or even months to completely ingrain in my noggin. But I don’t got no time for that stuff! So, I did the next best thing; copy my friend’s config :) (Thanks draff).

My `flake.nix` and `home.nix` probably look different than yours, that’s because I have followed Drake Rossman’s immaculate guide on setting up home-manager as a module (I want my home-manager to rebuild alongside NixOS cuz it’s just more convenient and I am a lazy bum). Also I moved everything inside `/etc/nixos` to `/home/quiet/Documents/nixos` and symlinked them to the original folder so I can edit them as user without root.

The two important lines I’d recommend adding to `configuration.nix` are:

```nix
nix.settings.experimental-features = ["nix-command" "flakes"];
environment.systemPackages = with pkgs; import ./packages.nix { inherit pkgs; };
```

Now I can keep the `configuration.nix` file clean and declare my system packages in `packages.nix` like such:

```nix
{ pkgs, … }:
with pkgs; [
  vim
  git
  kitty
  # and so on
]
```

This is my `flake.nix`:

```nix
{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    hyprland.url = "github:hyprwm/Hyprland";
    catppuccin.url = "github:catppuccin/nix";
    zen-browser.url = "github:0xc000022070/zen-browser-flake";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, catppuccin, home-manager, zen-browser, ... } @ inputs:
  {
    nixosConfigurations.nixchan = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs = { inherit inputs; };

      modules = [
        ./configuration.nix
        ./hyprland.nix
        ./fonts.nix
        catppuccin.nixosModules.catppuccin
        home-manager.nixosModules.home-manager
        {
          home-manager.useGlobalPkgs = true;
          home-manager.backupFileExtension = "HMBackup";
          home-manager.useUserPackages = true;
          home-manager.users.quiet.imports = [
            ./home.nix
            catppuccin.homeManagerModules.catppuccin
          ];
          home-manager.extraSpecialArgs = { inherit inputs; system = "x86_64-linux"; };
        }
      ];
    };
  };
}
```

The key line here is to add the following line to your flake inputs:

```nix
zen-browser.url = "github:0xc000022070/zen-browser-flake";
```

Let’s look at my `home.nix`:

```nix
{ config, pkgs, system, inputs, ... }:

{
  home.username = "quiet";
  home.homeDirectory = "/home/quiet";

  # Packages that should be installed to the user profile.
  home.packages = with pkgs; [
    zip
    xz
    unzip
    p7zip
    oh-my-zsh
    oh-my-posh
    inputs.zen-browser.packages."${system}".specific
  ];

  # basic configuration of git, please change to your own
  programs.git = {
    enable = true;
    userName = "notquitethereyet";
    userEmail = "example@example.com";
    extraConfig = {
      init.defaultBranch = "main";
    };
  };

  # Catpussy thing
  catppuccin = {
    enable = true;
    flavor = "mocha";
    accent = "blue";
  };

  # This value determines the home Manager release that your
  # configuration is compatible with. This helps avoid breakage
  # when a new home Manager release introduces backwards
  # incompatible changes.
  #
  # You can update home Manager without changing this value. See
  # the home Manager release notes for a list of state version
  # changes in each release.
  home.stateVersion = "23.11";

  # Let home Manager install and manage itself.
  programs.home-manager.enable = true;
}
```

If you don’t want to pass in your system from `flake.nix`, you could also declare it as a variable in `home.nix` as such:

```nix
{ config, pkgs, system, inputs, ... }:
let
  system = "x86_64-linux";
in
{
  home.username = "quiet";
  home.homeDirectory = "/home/quiet";
  ## rest of home.nix
}
```

Now, all we gotta do is rebuild the system!

```sh
sudo nixos-rebuild switch
```

Voila! Now you have Walmart version of Arc Browser installed on your NixOS system (I kid! I prefer Zen over Arc because it’s based on Firefox and not Chromium).



## Conclusion

For the impatient who can not wait for Zen Browser to be added to the NixOS packages, this can let us install Zen from a stranger’s flake on github!
This is a godsend for folks who don’t want to compile it from source (my ThinkPad took 3 hours to compile it, I think. And what’s worse? It immediately got an update!). So thanks to the maintainer who did it for us!

Keep in mind that running random flakes can be a security compromise! This is not a guide per se and more like “I wish this existed when I was trying to do it” for myself and people like me who lack reading comprehension and can not simply “RTFM” like my fellow Arch users like to say.

Also, I know GNU/Linux users do not like casuals like me who just want their systems to work and not spend 6 hours finding out why something does not work. I am impatient and am just concerned with the how to make it work part. I apologize in advance and do not intend any offense. I just wanted to jump the Windows (or bimbos as I call it) ship and never look back! So please direct your death threats and angry complaints to either my email, or my twitter (my ass is not calling it X).

Also, my big-dawg is currently being hospitalized for subdural hematoma and subarachnoid hemorrhage. He has much to do in this world still. Keep him in your prayers and pray for his recovery.

Cheers! <br>
quiet🌸
