echo "stop server"
cd /home/ec2-user/frontend/deploy
kill $(ps -ef | grep node | awk '{print $2}')