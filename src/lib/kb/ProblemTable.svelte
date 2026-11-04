<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import tickets from '#lib/data/tickets-4471.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket } from '#lib/kb/problems';

  let { ticket }: { ticket: number } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const ticketOf = (p: string) => (tickets as Record<string, { number: number; url: string }>)[p];
  const list = (n: Record<string, number>) =>
    Object.entries(n)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ×${v}`)
      .join(' · ');
  const subjectCount = $derived(new Set(split.merged.map((r) => r.subject)).size);
</script>

<p class="sum">
  <strong>{split.merged.length}</strong> reports merged into #{ticket} ·
  <strong>{split.groups.length}</strong>
  {split.groups.length === 1 ? 'problem' : 'problems'} · each report counted once
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>came in by</th><th>tenants</th><th>intake tagged</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      {@const t = ticketOf(g.problem)}
      <tr class:unplaced={!t}>
        <td><code>{g.problem}</code></td>
        <td class="n">{g.reports.length}</td>
        <td class="small">{list(g.channels)}</td>
        <td class="n">{g.tenants}</td>
        <td class="small">{list(g.taggedAs)}</td>
        <td class="small seen">{g.firstSeen}<br />{g.lastSeen}</td>
        <td>{#if t}<a href={t.url}>#{t.number}</a>{:else}none yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p class="note">
  {split.sharedSubjects.length} of {subjectCount} subject lines show up under more than one problem.
</p>

<style>
  .sum { font-size: 1.1rem; }
  .n { font-variant-numeric: tabular-nums; }
  .small { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
  .seen { white-space: nowrap; }
  .unplaced td { background: var(--warn-bg); }
</style>
