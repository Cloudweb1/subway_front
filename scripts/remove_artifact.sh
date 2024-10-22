echo "remove artifact"
find /home/ec2-user/deploy_front -maxdepth 1 ! -name 'node_modules' -exec rm -rf {} +