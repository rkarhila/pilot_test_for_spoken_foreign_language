#!/bin/bash

REMOTE_ADDRESS=user@backup.ser.ver:/path/to/backup

echo "Exporting records...(JSON arrays of all collections)"

outdir="`date -u +"%F_%H-%M-%S%z"`.${HOSTNAME}"
mkdir -p db_backup/$outdir

for collection in userlist feedback tests tasks trials; do 
  mongoexport --db nodetest2 --collection $collection --out db_backup/$outdir/$outdir.${collection}.json --jsonArray
done

echo "Transferring to backup server..."

scp -r db_backup/$outdir $REMOTE_ADDRESS/mongo_snapshots/

rsync -trvh uploads $REMOTE_ADDRESS/server_backups/
