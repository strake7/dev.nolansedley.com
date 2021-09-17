Resources for understanding ASPNET framework request context deadlocks
ASP.NET Framework Deadlocks
No SynchronizationContext in ASP.NET Core
Key take-aways:
1. ASP.NET Framework has a request context that threads execute code in. After you await a Task, when the method continues it will continue in a context. 
1. This request context only allows for one thread in at a time
1. A deadlock happens when a top-level method synchronously blocks the context thread waiting for a Task to complete while the Task's continuation is stuck waiting for the same context to become free.
1. To avoid this do not block async methods synchronously or, if not possible, use ConfigureAwait(false) through the whole async stack (also library code!)