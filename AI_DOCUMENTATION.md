**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

When building the GET /api/events endpoint, I needed it to return each event with the username of whoever created it and a count of how many people RSVPed. I knew I needed a JOIN but I wasn't sure how to combine a JOIN with a COUNT across two different tables at the same time. I asked:

> *"I'm building an event planning API. I need to query all events and include the username from the users table and a count of RSVPs from the rsvps table. How do I write that SQL query?"*

I used AI here because I understood what I wanted the data to look like but didn't know the exact SQL syntax to get there. It felt like a good use case since I had a clear goal but just needed help with the mechanics.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

The AI gave me a query using JOIN, LEFT JOIN, COUNT, and GROUP BY. I tested it directly in psql using my actual table names and checked that the output matched what the API contract said the response should look like — each event with a username field and an rsvp_count field. When I ran it and got back the right shape, I knew it was working correctly.

**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

The AI used SELECT * which would have caused a GROUP BY error in Postgres because you have to list every non-aggregated column explicitly. I had to change it to SELECT events.*, users.username and add events.event_id, users.username to the GROUP BY clause. That told me I understood enough about the problem to catch the issue — I just needed help getting the basic structure right.

**4. What did you learn from using AI in this way?**

I learned that LEFT JOIN is important here instead of a regular JOIN because if an event has zero RSVPs, a regular JOIN would drop it from the results entirely. I also learned that COUNT with GROUP BY requires you to be explicit about which columns you're grouping by in Postgres. I wouldn't have understood either of those things just by reading documentation — seeing the query and testing it myself made it click.