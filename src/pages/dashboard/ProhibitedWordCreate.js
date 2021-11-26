import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getWordList } from '../../redux/slices/prohibitedword';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProhibitedWordNewForm from '../../components/_dashboard/prohibited-words/ProhibitedWordNewForm';

// ----------------------------------------------------------------------

export default function ProhibitedWordCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { word } = useParams();
  const { wordList } = useSelector((state) => state.prohibatedword);
  const isEdit = pathname.includes('edit');
  const currentWord = wordList.find((prohibitedwords) => paramCase(prohibitedwords.word) === word);

  useEffect(() => {
    dispatch(getWordList());
  }, [dispatch]);

  return (
    <Page title="User: Create a new user | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new prohibited word' : 'Edit prohibited word'}
          links={[{ name: 'List of Prohibited Words', href: PATH_DASHBOARD.prohibitedwords.root }]}
        />
        <ProhibitedWordNewForm isEdit={isEdit} currentWord={currentWord} />
      </Container>
    </Page>
  );
}
