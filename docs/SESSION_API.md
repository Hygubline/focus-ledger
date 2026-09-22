# Session API

The API stores sessions in the existing D1 `sessions` table. The Site is currently private to its owner.

| Method | Path | Result |
| --- | --- | --- |
| `GET` | `/api/sessions` | `{ "sessions": [...] }`, newest first |
| `POST` | `/api/sessions` | `{ "session": {...} }`, status `201` |
| `GET` | `/api/sessions/:id` | `{ "session": {...} }` |
| `PATCH` | `/api/sessions/:id` | `{ "session": {...} }` |
| `DELETE` | `/api/sessions/:id` | Status `204` |

Create a session with JSON:

```json
{
  "category": "Programming",
  "startTime": 1789995600000,
  "endTime": 1790002800000,
  "durationSeconds": 5400,
  "note": "Built the Session API"
}
```

Times are Unix milliseconds. `durationSeconds` counts tracked time and may be less than the difference between start and end when a timer was paused. `note` is optional. The server creates the `id`.

Categories: `HVAC`, `Programming`, `Reading`, `Exercise`, `Meditation`, `Marketing`, `Gaming`, `Other`. Use `Gaming` for entertainment sessions. A `PATCH` body may contain any nonempty subset of the create fields; the resulting full session must remain valid. Invalid JSON or fields return `400`; unknown IDs return `404`; database failures return `503`.

The current Today and History interface still reads browser-local sessions. The API is ready, but the interface has not yet been connected or migrated to D1.
