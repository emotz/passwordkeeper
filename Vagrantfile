# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  config.vm.post_up_message = "If you don't see any errors above, then virtual machine is set up and running, all builds, watches and dev servers are running. You are ready to go! Open `http://localhost:1337` in your browser."

  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Private key for SSH
  #config.ssh.private_key_path = "d:/Work/Sources/JS/passwordkeeper/.vagrant/machines/default/virtualbox/private_key"

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "debian/jessie64"

	#config.ssh.username = 'vagrant'
	#config.ssh.password = 'vagrant'

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  config.vm.network "forwarded_port", guest: 8000, host: 8000 # test dev port
  config.vm.network "forwarded_port", guest: 1337, host: 1337 # main dev port
  config.vm.network "forwarded_port", guest: 4444, host: 4444 # selenium port
  config.vm.network "forwarded_port", guest: 35729, host: 35729 # live-reload port
  config.vm.network "forwarded_port", guest: 5858, host: 5858 # nodejs debug port
  config.vm.network "forwarded_port", guest: 5900, host: 5900 # vnc viewer port

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"


  # config.vm.synced_folder ".", "/vagrant", type: "rsync", rsync__exclude: [".git/", "node_modules/", ".vscode/"]

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  config.vm.provider "virtualbox" do |vb|
    # Customize the amount of memory on the VM:
    vb.memory = "1024"
  end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.

  config.vm.synced_folder ".", "/vagrant", type: "virtualbox"
  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    echo "Preparing local node_modules folder..."
    mkdir ~/vagrant_node_modules 2>/dev/null

    echo "export DISPLAY=:99" >> ~/.bashrc
    echo "cd /vagrant" >> ~/.bashrc
  SHELL
  config.vm.provision "shell", run: "always", inline: <<-SHELL
    mkdir /vagrant/node_modules 2>/dev/null
    mount --bind /home/vagrant/vagrant_node_modules /vagrant/node_modules
  SHELL
  config.vm.provision "shell", name: "Installing dependencies", inline: <<-SHELL
    echo "deb http://http.debian.net/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list

    # Add Google public key to apt
    wget -q -O - "https://dl-ssl.google.com/linux/linux_signing_key.pub" | apt-key add -

    # Add Google to the apt-get source list
    echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' | \
      tee /etc/apt/sources.list.d/google-chrome.list

    # Add NodeJS to the apt-get source list
    wget -q -O - https://deb.nodesource.com/setup_7.x | bash -

    # Add MongoDB to the apt-get source list
    #echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

    apt-get update
    apt-get install -y -t jessie-backports openjdk-8-jre
    apt-get install -y nodejs git g++ build-essential google-chrome-stable xvfb x11vnc
  SHELL
  config.vm.provision "shell", name: "Preparing postgres", path: "vagrant/postgres.sh"
  config.vm.provision "shell", name: "Preparing app", privileged: false, run: "always", inline: <<-SHELL
    cd /vagrant

    echo "Installing node modules (this will take a while)"
    npm install

    # this is fcking retarted, it picks up phantomjs launcher from another package dependency
    npm remove karma-phantomjs-launcher

    echo "Cleaning dist"
    npm run clean -s

    mkdir logs 2>/dev/null

    echo "Starting watch on everything"
    npm run watch -s > logs/watch.log 2>&1 &

    echo "Starting virtual graphics server"
    Xvfb :99 -screen 0 1920x1080x8 -nolisten tcp > logs/xvfb.log 2>&1 &
    XAUTHLOCALHOSTNAME=localhost x11vnc -display :99 -nopw > logs/x11vnc.log 2>&1 &
  SHELL
end
