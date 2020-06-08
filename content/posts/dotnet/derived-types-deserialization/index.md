---
title: Deserializing Derived Types in a .NET Core 3 API
date: 2020-06-07
# image: ./sunset-beach.jpg TODO: need image
# imageAlt: A beach at sunset with crashing waves.
---

As your .NET API matures you may find it lacks the ability to operate on a request that has a resource with multiple possible forms. As a primitive example let's say our API accepts a collection of musicians all derived from a common type; the request we expect to receive looks like this:

```http
POST http://localhost:5000/musicians HTTP/1.1
Content-Type: application/json

[
  {
    "instrumentType": "Guitar",
    "stringCount": 6,
    "canPlayWonderwall": true,
    "firstName": "Noel",
    "lastName": "Gallagher"
  },
  {
    "instrumentType": "Guitar",
    "stringCount": 6,
    "canPlayWonderwall": true,
    "firstName": "Nolan",
    "lastName": "Sedley"
  },
  {
    "instrumentType": "Piano",
    "handSpanRating": 15,
    "firstName": "Claude",
    "lastName": "Debussy"
  }
]

```
*Follow along with this article by referencing the [source code](https://github.com/strake7/dotnet-api-derived-types-example).*

A contract like this is fairly common and something that we should be able to support in our tooling. 

## Setup
Parsing this request we can see that the `instrumentType` property contains a value that denotes what other properties are present on the model. We should feel comfortable creating types that emulate this organization along with a controller to accept the request:

```C#
// model
public abstract class Musician
{
    public abstract string InstrumentType { get; }
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public class Guitarist : Musician
    {
        public override string InstrumentType { get; } = "Guitar";
        public int StringCount { get; set; }
        public bool CanPlayWonderwall { get; set; }
    }

    public class Pianist : Musician
    {
        public override string InstrumentType { get; } = "Piano";
        public int HandSpanRating { get; set; }
    }
}

// controller
[ApiController]
[Route("musicians")]
public class MusiciansController : ControllerBase
{    
    public ActionResult Post(IEnumerable<Musician> musiciansToCreate) => Accepted(musiciansToCreate);

}
```

Also note that for this example I will be using the community-favorite JSON serializer for .NET, [Newtonsoft.Json](https://github.com/JamesNK/Newtonsoft.Json). Even though .NET Core 3 has introduced [a new default serializer](https://docs.microsoft.com/en-us/dotnet/api/system.text.json?view=netcore-3.0), Newtonsoft remains the most fully featured solution at present. It is configured like so in the API's startup:

```C#
services
  .AddControllers()
  .AddNewtonsoftJson(services => {  });
```
## Initial Results
Calling this endpoint, as is, we are confronted by an unfortunate realization that the deserializer has no way of creating an instance of the abstract class `Musician`.

>Could not create an instance of type Musician. Type is an interface or abstract class and cannot be instantiated. Path '[0].instrumentType', line 3, position 21.

This error suggests that the serializer needs a way to discriminate based on a value what type to deserialize to.

## Newtonsoft TypeNameHandling
From here, it is natural to look at the default functionality offered by Newtonsoft to find a solution. Newtonsoft's [TypeNameHandling]() automatically creates a `$type` property that denotes what type to serialize to and from. This solution works fine but does not allow us to [specify a custom discriminator field](https://github.com/JamesNK/Newtonsoft.Json/issues/1331#issuecomment-307619125). Additionally this approach has [security issues that you need to account for](https://github.com/dotnet/runtime/issues/30969#issuecomment-535779492). This is a quick and easy solution for internal-facing APIs but does not quite fit the bill given we have a specific discriminator.

## Custom JsonConverters and [JsonSubTypes]
The next best solution would be to write a custom JsonConverter to tell the serializer to act. It might start looking something like this:
``` c#
public class MusicianConverter : JsonConverter<Musician>
{
    public override Musician ReadJson(JsonReader reader, Type objectType, Musician existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
      ...
        var jObject = JObject.Load(reader);
        var typeDiscriminator = jObject["instrumentType"].Value<string>();
        switch (typeDiscriminator)
        {
            case "Guitar":
                return serializer.Deserialize<Musician.Guitarist>(reader);              
            case "Piano":
                return serializer.Deserialize<Musician.Pianist>(reader);    
            default:
                throw new NotSupportedException();
        }   
      ...
    }
}
```
This implementation achieves the goal we set out for and writing a custom converter is a good exercise to understand the control we can achieve with our serializer. 

As you add more models and types you may realize this converter can be refactored into something more generic. Fortunately, the [JsonSubTypes](https://github.com/manuc66/JsonSubTypes) author has already published this for us! With the JsonSubTypes library we can simply use attributes or fluent registration to describe our models known derived types:
```c#
.AddNewtonsoftJson(options =>
  {
      options.SerializerSettings.Converters.Add(
          JsonSubtypesConverterBuilder
          .Of(typeof(Musician), nameof(Musician.InstrumentType))
          .RegisterSubtype(typeof(Musician.Guitarist), "Guitar")
          .RegisterSubtype(typeof(Musician.Pianist), "Piano")
          .SerializeDiscriminatorProperty()
          .Build()
      );
  });
```
**OR**
```c#
[JsonConverter(typeof(JsonSubtypes), nameof(Musician.InstrumentType))]
[JsonSubtypes.KnownSubType(typeof(Guitarist), "Guitar")]
[JsonSubtypes.KnownSubType(typeof(Pianist), "Piano")]
public abstract class Musician{...}
```
**Success!** 

## Anything else?
- TODO: Documentation is still important. 
- There are a number of ways to design an API contract. One could argue that composition is a more favorable approach over inheritance for this example. Analyzing service design was not a goal of this article.

## Source
You can find the final source code for this example on my [GitHub](https://github.com/strake7/dotnet-api-derived-types-example).
