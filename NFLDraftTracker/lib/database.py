import os
import shutil


def restore_backup(DATABASE_PATH, BACKUP_DIR, filename):
    backup_path = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(backup_path):
        raise FileNotFoundError(f"Backup file {filename} not found.")
    shutil.copy(backup_path, DATABASE_PATH)


def create_backup(DATABASE_PATH, BACKUP_DIR, filename):
    if filename:
        backup_path = os.path.join(BACKUP_DIR, "{}".format(filename))
    else:
        backup_path = os.path.join(BACKUP_DIR, f"backup_{len(os.listdir(BACKUP_DIR)) + 1}.db")
    shutil.copy(DATABASE_PATH, backup_path)
    return backup_path


def get_backup_list(BACKUP_DIR):
    backups = [file for file in os.listdir(BACKUP_DIR)
               if os.path.isfile(os.path.join(BACKUP_DIR, file))
               and file.endswith(".db")]
    return backups
