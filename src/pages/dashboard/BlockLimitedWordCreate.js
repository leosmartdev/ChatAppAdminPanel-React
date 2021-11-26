import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getWordList } from '../../redux/slices/blocklimitedword';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import BlockLimitedWordNewForm from '../../components/_dashboard/blocklimitedwords/BlockLimitedWordNewForm';

// ----------------------------------------------------------------------

export default function BlockLimitedWordCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { word } = useParams();
  const { wordList } = useSelector((state) => state.blocklimitedword);
  const isEdit = pathname.includes('edit');
  const currentWord = wordList.find((blocklimitedwords) => paramCase(blocklimitedwords.word) === word);

  useEffect(() => {
    dispatch(getWordList());
  }, [dispatch]);

  return (
    <Page title="Word Restrication: Create a new block limited word | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new block limited word' : 'Edit block limited word'}
          links={[{ name: 'List of Block Limited Words', href: PATH_DASHBOARD.blocklimitedwords.root }]}
        />

        <BlockLimitedWordNewForm isEdit={isEdit} currentWord={currentWord} />
      </Container>
    </Page>
  );
}
