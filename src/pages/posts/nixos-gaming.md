---
title: "NixOS Gaming Setup"
description: "Setting up NixOS for gaming"
date: 2024-11-17
tags: ["linux", "nixos", "configuration"]
layout: ../../layouts/BlogLayout.astro
---

# Gaming on NixOS! ❄️



## Introduction

![cirno from assets](/cutesite/assets/blog/nixos-gaming/cirno.webp)
<div class="image-caption">cirno for NixOS</div>

In my last post, I lauded NixOS as I installed Zen Browser from an external flake. And I can already hear you saying, “Enough with the NixOS hype, just let me play some games!” I get you! After all, who wouldn’t want to experience sultry verbal abuse from Kainé (RIP Atsuko Tanaka) in NieR: Replicant, or get groomed by Tae Takemi in Persona 5? And, of course, seeing what 10 years in the joint did to Kiryu in Yakuza after a long, hard day of watching VTubers and simping in every cosplayer’s comments. All of this, on NixOS, of course.

In this post, I’ll (hopefully) guide you through setting up gaming on NixOS with Wayland and Hyprland, documenting the journey along the way. Let’s start by enabling OpenGL drivers in our `configuration.nix` file.

```nix
# configuration.nix
{ config, pkgs, inputs, … }:
{
   hardware.opengl = {
      enable = true;
      driSupport = true;
      driSupport32bit = true;
    };
}
```

Next, depending on your setup, you’ll need to enable the appropriate GPU drivers. We all know the infamous NVIDIA woes on Linux — especially with Wayland! But don’t worry, it’s been improving. I’ve played through the entirety of God of War Ragnarok and NieR: Automata on my Hyprland/Arch setup, so I’m hopeful that NixOS will be just as smooth.

For Nvidia, you’ll need this line in your configuration:

```nix
services.xserver.videoDrivers = ["nvidia"];
# services.xserver.videoDrivers = ["amdgpu"];
```

For NVIDIA users, you might also need to enable modesetting:

```nix
hardware.nvidia.modesetting.enable = true;
```



## Gaming Laptops

But wait — if you’re like a 4head like me and you bought an NVIDIA hybrid gaming laptop to run Linux on (Why are we still here? Just to suffer? Every night, I can feel…), you’ll need to enable Prime (not the dogass energy drink, I like the white Monster). This allows you to offload graphic tasks to your dedicated GPU (dGPU) or suspend it for power-saving, depending on the workload.

You have two options: sync and offload. Sync keeps the dGPU running constantly, which is usually overkill. On the other hand, Offload wakes up the dGPU when needed and lets the integrated GPU (iGPU) handle lower workloads (effectively makes my laptop’s battery-life last longer than me).

On Arch, I have used `rog-control-center` (basically, Armory Crate for the 4chan herd) and can vouch for its ability to adjust temperature limits, fan curves reliably (for the 600 inappropriate Skyrim mods you probably have installed). You can also use `supergfxctl`, a tool by the same devs, to switch between integrated, hybrid, and VFIO (for GPU passthrough to VMs) modes.

Run this command to get your bus IDs for the GPUs:

```sh
nix shell nixpkgs#pciutils -c lspci | grep VGA
```

Example output:
```
00:02.0 VGA compatible controller: Intel Corporation Raptor Lake-P [UHD Graphics] (rev 04)
01:00.0 VGA compatible controller: NVIDIA Corporation AD107M [GeForce RTX 4060 Max-Q / Mobile] (rev a1)
```

Add the bus IDs into your `configuration.nix`:

```nix
{ pkgs, ...}:

{
  hardware.nvidia.prime = {
    offload = {
      enable = true;
      enableOffloadCmd = true; # Lets you use `nvidia-offload %command%` in steam
    };
    
    intelBusId = "PCI:00:02:0";
    # amdgpuBusId = "PCI:0:0:0";
    nvidiaBusId = "PCI:01:00:0";
  };
}
```

If you are an entitled zoomer who needs to have Family Guy and Subway Surfers videos running while you try to do anything remotely requires any cognitive ability (like most of us Linux folks), the official NixOS hardware repo has ready-to-use configurations for you. Just find your laptop model and copy the appropriate settings. (Pro tip: use flakes for this)

```nix
{
  description = "A very basic flake";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    nixos-hardware.url = "github:NixOS/nixos-hardware/master";
  };

  outputs = { nixpkgs, nixos-hardware, ... } @ inputs: 
  {
   nixosConfigurations.nixchan = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs = { inherit inputs; };

      modules = [
      ./configuration.nix
       nixos-hardware.nixosModules.asus-zephyrus-gu603h # this is my laptop
      ];
    };
  };
}
```



## Installing Software

To make your life easier, enable Steam and add a few essential packages to your system. I recommend `mangohud` (for performance monitoring) and `protonup-qt` (to install custom Proton versions, which can improve game compatibility).

```nix
programs.steam.enable = true;
programs.steam.gamescopeSession.enable = true;
programs.gamemode.enable = true;

environment.systemPackages = with pkgs; [mangohud protonup-qt lutris bottles heroic];
```

Once that’s done, you can switch between custom Proton versions in the Steam compatibility tab for each game. And if you’re playing non-Steam games (🏴‍☠️), I highly recommend using Heroic — it simply works™️.

If you’re ever stuck, check the community’s recommendation for Steam launch arguments on [protondb](https://www.protondb.com/)!



## Conclusion

And that’s it! With just a bit of configuration, your NixOS system should be ready to game. Now you can bring up that you use NixOS(btw) in every conversation you have! Also big thanks to Vimjoyer for educating imbeciles like me! A major chunk of this post is based on his video.

P.S. If you like my tip, zip me up when you are done with it!

Cheers!  
quiet🌸