import { object, string, lazy, number } from 'yup';
import { uniqueNamesGenerator, names, colors, animals } from 'unique-names-generator';

const placeholder = {
  name: "Placeholder",
  male: "place",
  female: "place",
  genderOnly: false,
  metaData: {
    src: "local",
    tags: []
  }
};
const listOfBreeds = [placeholder];

class DragonBuilder {
  static createWithMetadata(attributes = {}) {
    return {
      ...this.create(),
      selected: false,
      ...attributes
    };
  }
  static create(attributes = {}) {
    return {
      code: this.generateCode(),
      name: this.generateName(),
      parents: {},
      breed: placeholder.name,
      gender: "m",
      display: 1,
      ...attributes
    };
  }
  static generateCode() {
    const characters = "1234567890ABCDEFGHIJKLMNOPQRTUVWXYZabcdefghijklmnopqrstuvwyz";
    let str = "";
    for (let i = 0; i < 5; ++i) {
      str += characters[~~(Math.random() * characters.length)];
    }
    return str;
  }
  static generateName() {
    return uniqueNamesGenerator({
      dictionaries: [names, colors, animals],
      length: 2,
      separator: " ",
      style: "capital"
    });
  }
}

const NAMEREGEXP = /^[a-zA-Z0-9]([a-zA-Z0-9― —’–'-]+)[a-zA-Z0-9]$/;
const BREEDNAMEREGEXP = /[a-zA-Z0-9 ]{1,32}/;
const codeValidator = string().default("").test(
  "code",
  ({ value }) => `Codes must be 4 to 5 characters and alphanumeric.
  ${value} was given.`,
  validateCode
);
const nameValidator = string().default("").test(
  "name",
  ({ value }) => `Names must be 1 to 32 characters in length and only contain
    alphanumeric characters, spaces apostrophes and dashes.
    Additionally non-alphanumeric characters must not be
    present at the start and end of name. ${value} was given.`,
  validateName
);
const dragonSchema = object().shape({
  name: nameValidator.required().default(() => DragonBuilder.generateName()),
  code: codeValidator.required().default(() => DragonBuilder.generateCode()),
  display: number().required().oneOf([0, 1]).default(0),
  breed: lazy(
    () => string().required().matches(
      BREEDNAMEREGEXP,
      ({ value }) => `Breed names must be 1 to 32 characters in length and only contain
          alphanumeric characters or spaces. ${value} was given.`
    ).oneOf(
      getTrueBreeds(),
      ({ value }) => `Breed names must be official. ${value} was given.`
    ).default(placeholder.name)
  ),
  gender: string().required().oneOf(["m", "f"]),
  parents: object().required().default({}).shape({
    m: lazy(() => dragonSchema.default(void 0)),
    f: lazy(() => dragonSchema.default(void 0))
  }).shape({})
}).noUnknown();
function validateName(name) {
  return NAMEREGEXP.test(name) && name.length >= 1 && name.length <= 32;
}
function validateCode(code) {
  return NAMEREGEXP.test(code) && code.length >= 4 && code.length <= 5;
}
function validateLineageHash(str) {
  return /^[a-f0-9]{40}$/.test(str);
}
function getTrueBreeds() {
  return listOfBreeds.filter((breed) => breed.metaData.src !== "ghost").map((breed) => breed.name);
}

export { codeValidator as c, dragonSchema as d, validateLineageHash as v };
//# sourceMappingURL=validation.mjs.map
