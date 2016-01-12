# set REMOTE_ADDRESS=user@backup.ser.ver:/path/to/backup
# here or in your command prompt, whatever you like.


rsync -trvh $REMOTE_ADDRESS/uploads/encoded_video uploads/

rsync -trvh $REMOTE_ADDRESS/mongo_snapshots .

