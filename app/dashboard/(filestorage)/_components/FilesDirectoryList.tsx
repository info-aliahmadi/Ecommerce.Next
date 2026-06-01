'use client'
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';

// project import
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Folder } from '@mui/icons-material';
import { fileSizeViewer } from '@root/utils/fileSizeViewer';
import Notify from '@dashboard/_components/@extended/Notify';
import MainCard from '@dashboard/_components/MainCard';
import FileStorageService from '@dashboard/(filestorage)/_service/FileStorageService';
import { useSession } from 'next-auth/react';

import DirectoryModel from '../_types/DirectoryModel';
import { Capitalize } from '@root/utils/StringViewer';
// ===============================|| COLOR BOX ||=============================== //

function FilesCategoryList() {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const [directories, setDirectories] = useState<DirectoryModel[]>([]);

  const [notify, setNotify] = useState<NotifyProps>({ open: false });

  let fileStorageService = new FileStorageService(jwt ?? '');

  const loadDirectories = () => {
    fileStorageService
      .getDirectoriesList()
      .then((result) => {
        setDirectories(result.data ?? []);
      })
      .catch((error) => {
        setNotify({ open: true, type: 'error', description: error });
      });
  };

  useEffect(() => {
    loadDirectories();
  }, []);

  return (
    <>
      <Notify notify={notify} setNotify={setNotify}></Notify>
      <MainCard title={t('pages.cards.filesDirectory')}>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {directories.map((directory) => (
            <ListItemButton key={'dir-' + directory.directoryName} href={'/dashboard/filestorage/files-list/' + directory.directoryName}>
              <ListItemAvatar>
                <Avatar>
                  <Folder />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={Capitalize(directory.directoryName)}
                secondary={
                  directory.filesCount +
                  ' ' +
                  (directory.filesCount > 1 ? t('fields.fileStorage.files') : t('fields.fileStorage.file')) +
                  ' / ' +
                  fileSizeViewer(directory.directorySize, true)
                }
              />
            </ListItemButton>
          ))}
        </List>
      </MainCard>
    </>
  );
}

export default FilesCategoryList;
