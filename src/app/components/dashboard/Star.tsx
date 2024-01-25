import Image from "next/image";
import React from "react";

function Star({ count }: any) {
  let stars: any[] = [];

  for (let i = 0; i < count; i++) {
    stars.push(
      <Image
        key={i}
        src={
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA3VJREFUWEe9l12IlFUYx3/PeWc/Z8VybfVGEjRQAnd32M2CiAIFu9EL2y4SUnAVNfKr7iyNuulCKjAinN2FBCEC7+wiL0QCWVl2W7Z2+riIsGQFFyLM3XXmnTlPndcd3Zne133nnbVzO3Oe/+/8z/NxXqGOpV/1eXSvTstTZ24nDSNJN+ro/gZgA6bUK5nBoaRxkgOM71kLqbOgDbS17kjqQiKA4PSefRG4BNxE9Z2kLiQDcKcXbwiVlwAf9GpSF2oGqDp9+eoTu1A7QOXpywCJXagJQHN9jRSWbwG+Dsn6myjvYs056Tnrx62K2ACB9aniZtR8DjwdIuAjjFHiGGrG4kIsCqCKMNzXTPrxjWjp9HziRR3wHoTKW7Q1T8YpzQqAQOzHvgZupQ0dXit5bUbNSjzZgOpO4NUY1vooP2MkC3wD+RnUzLCqscAUfrUzorm9K5jzmpBSGmQ5Ke8JiqVWPOlEdR3CVpSOGMLVf3F5cB3VUZAJYAqPG/hmipRaCsU5UF90fP9usM//S/tcxN0m0I7c4qplGmQWdBwYER3rfxbDR0An0LqUag+JVQC5ivCmBNktdhNGT4K4EnvUEA/Eu7K5IAn/R4gKcad9vwoeMYQCsyAjge1d2Vz5eirLsHwdwimEbYCb+UuxZoLuKfL+QvEKB8oqgROm2APmU4TMEqhbYBKR16rFQwGCnPjjWAu3/t6Owb106k3Kv4DPpHvgRNhhIluxjh9YC8UvgBfqcMHd/Q9oyxbJnJmuDeBa/yqaOAUcrAOggOplyQy+HBUj2oGJAx1o8QTK4ToA8giXpGtge+0Abkb45gjqGlTi5bL/gnQP7K4dYGTPahpSHwD9ieXde1H1W8kMug4buqKv4Lu9TyLBSN1aB4DbOsnKZc/Imo/nakvCsf6NeFwJGcUW5A7oDMosQgkkDdo2X7LVzes3PLtLNg0NxwZQfc/w/VQv1l5bsKkE/An8jsowYkfBTGDtHVKmh5LtRWRz8LUE7ff3CTcQOSqd2QvxAXKH2vDzu1Bx7z/XyW6D/gLyJdpyPqymgw7ayDqsvoLa10FWzINMo/KhZLJu5P9nheaA/vRGO3fzx4EjwK/ARbTlk6hmsjBqCEgTcCWqEsIBXAWkUm8j2o6Y02E9fLHEXACyA2vXS2ZwX2wHFgtey+/3hlvTY1Hu/QPAwWF1n7nvPAAAAABJRU5ErkJggg=="
        }
        width={16}
        height={16}
        alt={`star${i}`}
      />
    );
  }

  return <div className="flex gap-1">{stars.length > 0 && stars}</div>;
}

export default Star;
