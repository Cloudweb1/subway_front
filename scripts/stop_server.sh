echo "stop server"
cd /home/ec2-user/deploy_front
kill $(ps -ef | grep node | awk '{print $2}')