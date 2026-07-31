import { GET } from './src/pages/api/contributions/[username].ts';
(async () => {
  try {
    const res = await GET({ params: { username: 'octocat' } });
    const status = res.status;
    const text = await res.text();
    console.log('STATUS', status);
    console.log(text);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
