---
title: The `TOP 1` Threat
date: 2021-02-02
image: ./top1.png
imageAlt: Image of TOP 1 query
---
Well, 'Threat' is an extreme word to use but is worth the buzz, right? 

This article stems from a comment a coworker posted on a repository I also
monitor. The comment called into question the use of `TOP 1` in a MSSQL query
using unique criteria in the where clause.A simplified example of the query
looks something like this: 
```C#
SomeEntity.Select("select TOP 1 Id from Users where username = '@username'").Execute().FirstOrDefault();
``` 
In this example, the column `username` is guaranteed to be unique by an index on
the table. My colleague's comment argued that the use of `TOP 1` is redundant.
At first, this seemed arbitrary and a tad of a nitpick. Then I recalled a bug
long ago, where once upon a time, a unique index constraint was dropped from a
table and I spent many hours sifting text to find similar code. That is, `TOP 1`
is not a replacement for the unique index in performance or in ensuring data
integrity. Its presence, in this example, can be a danger to future .

To elucidate, in this example `TOP 1` and `FirstOrDefault()`:
1. **Detract from the unique index present on the table** - By implementing
   these nonequivalent redundancies, the code suggests the data is not actually
   unique. Neither of these statements require unique data! The code has
   contradictory implications with the unique index. Additionally, newcomers may
   assume this is an acceptable pattern and overlook the need for a performant
   index or constraint.
1. **Mask unexpected issues with data integrity** - If the unique constraint was
   accidentally dropped from the table this code would continue to work and we
   might not figure out there is an issue with data integrity until it has
   impacted customers. This code  possible issues and can make them hard to
   find. 

You and I do not want any of these possibilities to occur. Fortunately the
proper implementation is easy in this situation: 
1. Do not use `TOP 1` - We expect a unique index; let's make sure it is used.
1. Use `SingleOrDefault` - Be explicit. We only expect one record. If there is
   more than one then there is likely a problem that is worthy of an exception.
   Help us catch bugs.

That is it. When in doubt, remember to keep it simple and avoid adding code that
is not purposeful. 