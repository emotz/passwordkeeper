Vagrant.configure(2) do |config|
	config.vm.box = "ubuntu/bionic64"

	config.vm.synced_folder ".", "/vagrant"

	config.vm.provision :docker
	config.vm.provision "pip-install", type: "shell", inline: "apt install -y python-pip"
	config.vm.provision "docker-compose-install", type: "shell", inline: "pip install docker-compose"
	config.vm.provision "docker-compose-pull", type: "shell", inline: "docker-compose -f /vagrant/docker-compose.yml pull", run: "always"
	config.vm.provision "docker-compose-build", type: "shell", inline: "docker-compose -f /vagrant/docker-compose.yml build", run: "always"

	config.vm.network :forwarded_port, guest: 35729, host: 35729 # live reload
	config.vm.network :forwarded_port, guest: 1337, host: 1337 # main app port
	config.vm.network :forwarded_port, guest: 9229, host: 9229 # node debug
  end
