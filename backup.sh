#!/bin/bash

TIMESTAMP=$(date +"%F-%H-%M")
BACKUP_DIR="./backup"
FILENAME="elvturc_db_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

mysqldump -h db -u root -pnumlock11 elvturc_db > "$BACKUP_DIR/$FILENAME"
