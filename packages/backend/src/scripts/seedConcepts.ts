import { ConceptModel } from "../models/Concept";
import { connectDB } from "../db";
import mongoose from "mongoose";

// Add new functional programming concepts
const updateConceptsList = () => {
  // Add functional programming concepts to the list
  concepts.push(
    {
      name: "Functional Programming",
      slug: "functional-programming",
      description:
        "Learn the fundamentals of functional programming, a declarative paradigm where programs are constructed by applying and composing functions.",
      category: "intermediate",
      language: "all",
      order: 15,
      dependencies: ["functions", "arrays"],
      resources: [
        {
          title: "Functional Programming in JavaScript",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functional_programming",
          type: "documentation",
        },
      ],
    },
    {
      name: "Map Function",
      slug: "map",
      description:
        "Learn how to transform arrays by applying a function to each element using the map method.",
      category: "intermediate",
      language: "all",
      order: 16,
      dependencies: ["functional-programming", "arrays"],
      resources: [
        {
          title: "JavaScript Array.prototype.map()",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map",
          type: "documentation",
        },
      ],
    },
    {
      name: "Filter Function",
      slug: "filter",
      description:
        "Learn how to create new arrays with elements that pass a test function using the filter method.",
      category: "intermediate",
      language: "all",
      order: 17,
      dependencies: ["functional-programming", "arrays"],
      resources: [
        {
          title: "JavaScript Array.prototype.filter()",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter",
          type: "documentation",
        },
      ],
    },
    {
      name: "Reduce Function",
      slug: "reduce",
      description:
        "Learn how to reduce an array to a single value by applying a function to each element and accumulating the result.",
      category: "intermediate",
      language: "all",
      order: 18,
      dependencies: ["functional-programming", "arrays"],
      resources: [
        {
          title: "JavaScript Array.prototype.reduce()",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
          type: "documentation",
        },
      ],
    },
    {
      name: "Higher-Order Functions",
      slug: "higher-order-functions",
      description:
        "Learn about functions that take other functions as arguments or return functions as results.",
      category: "advanced",
      language: "all",
      order: 19,
      dependencies: ["functional-programming"],
      resources: [
        {
          title: "Higher-Order Functions in JavaScript",
          url: "https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function",
          type: "documentation",
        },
      ],
    },
    {
      name: "Currying",
      slug: "currying",
      description:
        "Learn about the technique of transforming a function with multiple arguments into a sequence of functions with single arguments.",
      category: "advanced",
      language: "all",
      order: 20,
      dependencies: ["higher-order-functions"],
      resources: [
        {
          title: "Currying in JavaScript",
          url: "https://javascript.info/currying-partials",
          type: "documentation",
        },
      ],
    },
  );
};

// Enhanced version of challenge concept mappings
const updateChallengesWithConcepts = async () => {
  // Expanded map of challenge functionName to concept tags
  const conceptMappings: Record<string, string[]> = {
    // Basic challenges
    sum: ["variables", "operators"],
    multiply: ["variables", "operators"],
    isEven: ["conditionals", "operators"],
    reverse: ["strings", "arrays"],
    countVowels: ["strings", "loops"],
    findMax: ["arrays", "loops", "reduce"],
    filterEven: ["arrays", "functions", "loops", "filter"],
    isPalindrome: ["strings", "conditionals"],
    factorial: ["recursion", "functions"],
    fibonacci: ["recursion", "functions"],

    // Functional programming challenges
    doubleNumbers: ["functional-programming", "map", "arrays"],
    toUpperCase: ["functional-programming", "map", "strings"],
    filterEvenNumbers: ["functional-programming", "filter", "arrays"],
    filterLongWords: ["functional-programming", "filter", "strings"],
    sumArray: ["functional-programming", "reduce", "arrays"],
    averageOfEvenNumbers: [
      "functional-programming",
      "filter",
      "reduce",
      "arrays",
    ],
    wordLengthMap: ["functional-programming", "reduce", "objects"],
    groupByLength: ["functional-programming", "reduce", "objects", "arrays"],
    compose: ["functional-programming", "higher-order-functions"],
    curry: ["functional-programming", "higher-order-functions", "currying"],
    pipeline: ["functional-programming", "higher-order-functions"],
  };

  // Access collection directly for better flexibility
  const db = mongoose.connection.db;
  const challengeCollection = db.collection("challenges");

  // Get all challenges
  const challenges = await challengeCollection.find({}).toArray();
  let updatedCount = 0;
  let skippedCount = 0;

  // Update each challenge with conceptTags based on functionName
  for (const challenge of challenges) {
    if (conceptMappings[challenge.functionName]) {
      await challengeCollection.updateOne(
        { _id: challenge._id },
        { $set: { conceptTags: conceptMappings[challenge.functionName] } },
      );
      console.log(
        `✓ Updated challenge: ${challenge.title} with concepts: ${conceptMappings[challenge.functionName].join(", ")}`,
      );
      updatedCount++;
    } else {
      console.log(
        `⤫ Skipped challenge: ${challenge.title} (no concept mapping found)`,
      );
      skippedCount++;
    }
  }

  console.log(`
  Challenge concept mapping completed:
  - Updated: ${updatedCount}
  - Skipped: ${skippedCount}
  - Total: ${challenges.length}
  `);
};

// Define core programming concepts
const concepts = [
  {
    name: "Variables",
    slug: "variables",
    description:
      "Learn how to declare and use variables to store data in memory.",
    category: "fundamentals",
    language: "all",
    order: 1,
    dependencies: [],
    resources: [
      {
        title: "JavaScript Variables",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Variables",
        type: "documentation",
      },
      {
        title: "TypeScript Basic Types",
        url: "https://www.typescriptlang.org/docs/handbook/basic-types.html",
        type: "documentation",
      },
    ],
  },
  {
    name: "Operators",
    slug: "operators",
    description: "Learn about arithmetic, comparison, and logical operators.",
    category: "fundamentals",
    language: "all",
    order: 2,
    dependencies: ["variables"],
    resources: [
      {
        title: "JavaScript Operators",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators",
        type: "documentation",
      },
    ],
  },
  {
    name: "Conditionals",
    slug: "conditionals",
    description:
      "Learn how to control program flow with if/else statements and switch cases.",
    category: "fundamentals",
    language: "all",
    order: 3,
    dependencies: ["operators"],
    resources: [
      {
        title: "JavaScript if...else",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else",
        type: "documentation",
      },
    ],
  },
  {
    name: "Loops",
    slug: "loops",
    description: "Learn how to iterate using for, while, and do-while loops.",
    category: "fundamentals",
    language: "all",
    order: 4,
    dependencies: ["conditionals"],
    resources: [
      {
        title: "JavaScript Loops",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration",
        type: "documentation",
      },
    ],
  },
  {
    name: "Arrays",
    slug: "arrays",
    description: "Learn how to work with arrays and array methods.",
    category: "fundamentals",
    language: "all",
    order: 5,
    dependencies: ["loops"],
    resources: [
      {
        title: "JavaScript Arrays",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
        type: "documentation",
      },
      {
        title: "TypeScript Array Types",
        url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays",
        type: "documentation",
      },
    ],
  },
  {
    name: "Strings",
    slug: "strings",
    description:
      "Learn how to work with text using string methods and properties.",
    category: "fundamentals",
    language: "all",
    order: 6,
    dependencies: ["variables"],
    resources: [
      {
        title: "JavaScript Strings",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
        type: "documentation",
      },
    ],
  },
  {
    name: "Functions",
    slug: "functions",
    description:
      "Learn how to define and call functions, pass parameters, and return values.",
    category: "fundamentals",
    language: "all",
    order: 7,
    dependencies: ["variables", "operators"],
    resources: [
      {
        title: "JavaScript Functions",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
        type: "documentation",
      },
      {
        title: "TypeScript Functions",
        url: "https://www.typescriptlang.org/docs/handbook/2/functions.html",
        type: "documentation",
      },
    ],
  },
  {
    name: "Objects",
    slug: "objects",
    description:
      "Learn how to create and manipulate objects and object properties.",
    category: "fundamentals",
    language: "all",
    order: 8,
    dependencies: ["functions"],
    resources: [
      {
        title: "JavaScript Objects",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects",
        type: "documentation",
      },
      {
        title: "TypeScript Object Types",
        url: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
        type: "documentation",
      },
    ],
  },
  {
    name: "Error Handling",
    slug: "error-handling",
    description: "Learn how to catch and handle errors using try-catch blocks.",
    category: "intermediate",
    language: "all",
    order: 9,
    dependencies: ["conditionals", "functions"],
    resources: [
      {
        title: "JavaScript Error Handling",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#Exception_handling_statements",
        type: "documentation",
      },
    ],
  },
  {
    name: "Recursion",
    slug: "recursion",
    description:
      "Learn how to write functions that call themselves to solve complex problems.",
    category: "intermediate",
    language: "all",
    order: 10,
    dependencies: ["functions"],
    resources: [
      {
        title: "Understanding Recursion",
        url: "https://developer.mozilla.org/en-US/docs/Glossary/Recursion",
        type: "documentation",
      },
    ],
  },
  // TypeScript specific concepts
  {
    name: "Type Annotations",
    slug: "type-annotations",
    description:
      "Learn how to add type information to variables, functions, and parameters.",
    category: "fundamentals",
    language: "typescript",
    order: 11,
    dependencies: ["variables"],
    resources: [
      {
        title: "TypeScript Basic Types",
        url: "https://www.typescriptlang.org/docs/handbook/basic-types.html",
        type: "documentation",
      },
    ],
  },
  {
    name: "Interfaces",
    slug: "interfaces",
    description:
      "Learn how to define shapes for objects using TypeScript interfaces.",
    category: "intermediate",
    language: "typescript",
    order: 12,
    dependencies: ["objects", "type-annotations"],
    resources: [
      {
        title: "TypeScript Interfaces",
        url: "https://www.typescriptlang.org/docs/handbook/interfaces.html",
        type: "documentation",
      },
    ],
  },
  {
    name: "Type Aliases",
    slug: "type-aliases",
    description:
      "Learn how to create named types for reusability and organization.",
    category: "intermediate",
    language: "typescript",
    order: 13,
    dependencies: ["type-annotations"],
    resources: [
      {
        title: "TypeScript Type Aliases",
        url: "https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases",
        type: "documentation",
      },
    ],
  },
  {
    name: "Generics",
    slug: "generics",
    description:
      "Learn how to write flexible, reusable functions and types with generics.",
    category: "advanced",
    language: "typescript",
    order: 14,
    dependencies: ["interfaces", "functions"],
    resources: [
      {
        title: "TypeScript Generics",
        url: "https://www.typescriptlang.org/docs/handbook/generics.html",
        type: "documentation",
      },
    ],
  },
];

// Add new concepts to the list
updateConceptsList();

const seedConcepts = async () => {
  try {
    await connectDB();

    // Check if "true" is passed as a command line argument (force update)
    const forceUpdate = process.argv.includes("true");

    if (forceUpdate) {
      // Clear existing concepts
      await ConceptModel.deleteMany({});
      console.log("✓ Cleared existing concepts");

      // Insert new concepts
      await ConceptModel.insertMany(concepts);
      console.log(`✓ Successfully seeded ${concepts.length} concepts!`);
    } else {
      // Update or insert concepts without clearing
      let created = 0;
      let updated = 0;

      for (const concept of concepts) {
        const exists = await ConceptModel.findOne({ slug: concept.slug });

        if (!exists) {
          await ConceptModel.create(concept);
          console.log(`✓ Created concept: ${concept.name}`);
          created++;
        } else {
          await ConceptModel.findOneAndUpdate({ slug: concept.slug }, concept);
          console.log(`↻ Updated concept: ${concept.name}`);
          updated++;
        }
      }

      console.log(`
      Concept seeding completed:
      - Created: ${created}
      - Updated: ${updated}
      - Total: ${concepts.length}
      `);
    }

    // Update challenges with concept tags
    await updateChallengesWithConcepts();

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding concepts:", error);
    process.exit(1);
  }
};

// Run the seed function
seedConcepts();
