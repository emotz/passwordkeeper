Vagrant.configure(2) do |config|
  config.vagrant.plugins = ["vagrant-disksize"]

  config.vm.box = "ubuntu/bionic64"
  config.disksize.size = '30GB'

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "4096"
    vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.synced_folder ".", "/vagrant"

  config.vm.provision "default-directory", type: "shell", privileged: false, inline: "echo \"\\\n\\\ncd /vagrant\" >> /home/vagrant/.bashrc"

  config.vm.provision "nvm-install", type: "shell", privileged: false, inline: "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash"
  config.vm.provision "nvm-default", type: "shell", privileged: false, inline: <<-SHELL
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    nvm install 10
  SHELL

  config.vm.provision :docker
  config.vm.provision "pip-install", type: "shell", inline: "apt-get install -y python-pip"
  config.vm.provision "docker-compose-install", type: "shell", inline: "pip install docker-compose"
  config.vm.provision "docker-compose-pull", type: "shell", inline: "docker-compose -f /vagrant/docker-compose.yml pull || echo error but whatever"
  config.vm.provision "docker-compose-build-base", type: "shell", inline: "docker-compose -f /vagrant/docker-compose.yml build base"
  config.vm.provision "docker-compose-build", type: "shell", inline: "docker-compose -f /vagrant/docker-compose.yml build"

  config.vm.network :forwarded_port, guest: 35729, host: 35729 # live reload
  config.vm.network :forwarded_port, guest: 1337, host: 1337 # main app port
  config.vm.network :forwarded_port, guest: 9229, host: 9229 # node debug
end
