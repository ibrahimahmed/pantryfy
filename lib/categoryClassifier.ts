import { GroceryCategory } from "@/types/grocery";

const CATEGORY_KEYWORDS: Record<GroceryCategory, string[]> = {
  produce: [
    "apple", "banana", "orange", "lemon", "lime", "tomato", "onion", "garlic",
    "potato", "carrot", "celery", "lettuce", "spinach", "broccoli", "pepper",
    "cucumber", "avocado", "mushroom", "zucchini", "eggplant", "corn", "pea",
    "bean", "kale", "cabbage", "cauliflower", "asparagus", "artichoke",
    "beet", "radish", "turnip", "squash", "pumpkin", "ginger", "scallion",
    "shallot", "leek", "parsley", "basil", "mint", "cilantro", "dill",
    "chive", "arugula", "berry", "grape", "melon", "peach", "pear", "plum",
    "mango", "pineapple", "coconut",
  ],
  dairy: [
    "milk", "cheese", "butter", "cream", "yogurt", "egg", "sour cream",
    "mozzarella", "cheddar", "parmesan", "ricotta", "feta", "gouda",
    "brie", "cottage cheese", "whipped cream", "half and half",
    "cream cheese", "mascarpone",
  ],
  meat: [
    "chicken", "beef", "pork", "lamb", "turkey", "bacon", "sausage", "ham",
    "steak", "fish", "salmon", "tuna", "shrimp", "crab", "lobster",
    "scallop", "anchovy", "sardine", "prosciutto", "pepperoni", "duck",
    "veal", "bison", "venison", "chorizo",
  ],
  bakery: [
    "bread", "roll", "baguette", "croissant", "muffin", "bagel", "tortilla",
    "pita", "naan", "flatbread", "ciabatta", "sourdough", "brioche",
    "cracker", "breadcrumb",
  ],
  frozen: [
    "frozen", "ice cream", "frozen pizza", "frozen vegetable", "frozen fruit",
    "gelato", "sorbet", "frozen dinner",
  ],
  pantry: [
    "flour", "sugar", "rice", "pasta", "noodle", "oil", "vinegar",
    "soy sauce", "honey", "broth", "stock", "tomato sauce", "tomato paste",
    "can", "canned", "dried bean", "lentil", "chickpea", "quinoa",
    "oat", "cereal", "maple syrup", "peanut butter", "jam", "jelly",
    "mustard", "ketchup", "mayonnaise", "hot sauce", "worcestershire",
    "coconut milk", "cornstarch", "baking powder", "baking soda", "yeast",
    "vanilla extract", "cocoa powder", "chocolate", "nut", "almond",
    "walnut", "pecan", "cashew", "sesame",
  ],
  spices: [
    "salt", "pepper", "cumin", "paprika", "oregano", "thyme", "rosemary",
    "cinnamon", "ginger", "turmeric", "chili powder", "cayenne", "nutmeg",
    "coriander", "cardamom", "clove", "allspice", "bay leaf", "saffron",
    "curry", "garlic powder", "onion powder", "italian seasoning",
    "red pepper flake", "black pepper", "white pepper", "smoked paprika",
  ],
  beverages: [
    "water", "juice", "soda", "coffee", "tea", "wine", "beer",
    "sparkling water", "lemonade", "milk", "almond milk", "oat milk",
    "coconut water",
  ],
  other: [],
};

export function categorizeIngredient(name: string): GroceryCategory {
  const normalized = name.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return category as GroceryCategory;
    }
  }

  return "other";
}
