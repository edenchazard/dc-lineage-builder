import { freshDatabase } from '../../utils/dbSetup.js';

export default defineTask({
  meta: {
    name: 'db:fresh',
    description: 'Recreate the saved_lineages table',
  },
  async run() {
    await freshDatabase();

    return { result: 'Database recreated' };
  },
});
