// What #4471 holds when you split it by problem instead of by subject line.
// causes.ts tells `parser` from `hint` by tenant and channel. It can't see the third problem: a date
// that moves by one day. That one has nothing to do with day/month order, so the tenant's locale
// can't place it. The desk finds those by reading the report (desk-notes.json, `oneDayMove`).
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day';
export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'one-day'];

// A report the desk read as a one-day move is that problem, whatever its tenant writes.
// Everything else goes where causes.ts puts it.
export function problemOf(r: Report, t: Tenant | undefined, oneDay: readonly string[]): Problem | null {
  return oneDay.includes(r.id) ? 'one-day' : causeOf(r, t);
}

export type ProblemGroup = {
  problem: Problem | 'unplaced';
  reports: Report[];
  tenants: number;
  channels: Record<string, number>;
  taggedAs: Record<string, number>;
  subjects: Set<string>;
  firstSeen: string;
  lastSeen: string;
};

const tally = (rs: Report[], key: (r: Report) => string) =>
  rs.reduce<Record<string, number>>((n, r) => ({ ...n, [key(r)]: (n[key(r)] ?? 0) + 1 }), {});

// Every report merged into `ticket`, counted once, in exactly one group.
export function splitTicket(
  reports: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDay: readonly string[],
): { merged: Report[]; groups: ProblemGroup[]; sharedSubjects: string[] } {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const order: ProblemGroup['problem'][] = [...PROBLEMS, 'unplaced'];
  const groups = order
    .map((problem) => {
      const rs = merged.filter((r) => (problemOf(r, tenantOf(r), oneDay) ?? 'unplaced') === problem);
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        channels: tally(rs, (r) => r.channel),
        taggedAs: tally(rs, (r) => r.meta.intakeTag),
        subjects: new Set(rs.map((r) => r.subject)),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      };
    })
    .filter((g) => g.reports.length > 0);
  // Subject lines that show up under more than one problem: decision 0001 merges these.
  const allSubjects = [...new Set(merged.map((r) => r.subject))].sort();
  const sharedSubjects = allSubjects.filter((s) => groups.filter((g) => g.subjects.has(s)).length > 1);
  return { merged, groups, sharedSubjects };
}
