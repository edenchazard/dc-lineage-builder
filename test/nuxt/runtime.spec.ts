import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { NuxtPage } from '#components';

describe('index page', () => {
  it('renders the lineage builder and its toolbar', async () => {
    const page = await mountSuspended(NuxtPage, { route: '/' });

    expect(page.find('h1').text()).toBe('Build');
    expect(page.find('.builder-container').exists()).toBe(true);
    expect(page.find('[role="toolbar"]').exists()).toBe(true);
  });
});
