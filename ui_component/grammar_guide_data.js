export const grammar_guide_data = {
  all_data:[
    {
      header: "い-adjectives",
      subheader: "",
      content: [
        {
          table: {
            headers: ["Dictionary", "Past (た)", "Negative (ない)", "Potential (ば)"],
            rows: [
              ["美味しい", "美味しかった", "美味しくない", "美味しければ"],
              ["Delicious", "Was delicious", "Not delicious", "If it’s delicious"],
              ["寒い", "寒かった", "寒くない", "寒ければ"],
              ["Cold", "Was cold", "Not cold", "If it’s cold"],
            ]
          }
        }
      ]
    },
    {
      header: "な-adjectives",
      subheader: "Function like nouns, and modify other nouns with な between the two nouns.",
      content: [
        {
          text: "綺麗な場所だ = It is a pretty place (Pretty place is)"
        },
        {
          text: "な adjectives can also function as nouns"
        },
        {
          text: "場所は綺麗だ = The place is pretty. (Place pretty is)"
        },
        {
          text: "な adjectives conjugate like nouns paired with the copula, so see **な adjective** conjugations for reference."
        }
      ]
    },
    {
      header: "Conjugating the Copula with **Nouns & な adjectives**",
      subheader: "Nouns and な adjectives conjugate with the copula だ as such.",
      content: [
        {
          text: "だ (is) ー だった (was) ー じゃない (is not) ー"
        },
        {
          text: "本だ (is book) ー 本だった (was a book) ー 本じゃない (is not a book)"
        },
        {
          text: "有名だ (is famous) ー 有名だった (was famous) ー 有名じゃない (is not famous)"
        }
      ]
    },
    {
      header: "Particles",
      subheader: "Particles are used to indicate the relationship between words in a sentence. They are placed after the word they modify.",
      content: [
        {
          text: "が - The subject marking particle (emphasis on what comes before)"
        },
        {
          text: "は - The topic marking particle (emphasis on what comes after. pronounced わ as a particle)"
        },
        {
          text: "を - The object marking particle"
        },
        {
          text: "に - When does it happen?"
        },
        {
          text: "で - Where does an action happen?"
        },
        {
          text: "と - The particle used to indicate a list of items or people"
        },
        {
          text: "から - The particle used to indicate the starting point of an action"
        },
        {
          text: "まで - The particle used to indicate the end point of an action"
        },
        {
          text: "より - The particle used to indicate a comparison"
        },
        {
          text: "へ - The particle used to indicate direction"
        },
        {
          text: "の -  The possession marking particle"
        },
        {
          text: "も - Also or Too"
        },
        {
          text: "か - Mark the unknown (make a statement a question)"
        },
        {
          text: "ね - The particle used to indicate agreement"
        },
        {
          text: "よ - The particle used to indicate emphasis"
        },
      ],
    },
    {
      header:"Existence in two verbs",
      subheader: "The verb いる is used for living things, while ある is used for inanimate objects.",
      content:[
        {
          table: {
            headers: ["いる", "ある"],
            rows: [
              ["To exist (animate)", "To exist (inanimate)"],
              ["いる is used for living things", "ある is used for inanimate objects"],
            ]
          }
        }
      ],
    },
    {
      header:"Regular Verb conjugations",
      subheader: "",
      content: [
        {
          header: "",
          table: {
            headers: ["Dictionary", "Past", "Negative", "Volitional", "Potential", "ている"],
            rows: [
              ["する","した", "しない", "しよう", "できる", "してる"],
              ["来る", "きた", "こない", "こよう", "こられる", "きてる"]
            ]
          }
        },
        {
          header: "Past tense conjugations",
          table: {
            headers: ["買う = 買った", "読む = 読んだ", "行く= 行った", "教える=教えた"],
            rows: [
              ["bought", "read (past)", "Went (“go” past)", "Taught"],
            ]
          }
        },
        {
          header: "Negative form conjugations",
          table: {
            headers: ["買う = 買わない", "読む = 読まない", "行く= 行かない", "教える=教えない"],
            rows: [
              ["Will not buy", "will not read", "Will not go", "Will not teach"],
            ]
          }
        },
        {
          header: "Potential form conjugations",
          table: {
            headers: ["買う = 買える", "読む = 読める", "行く= 行ける", "教える=教えられる"],
            rows: [
              ["Can buy", "Can read", "Can go", "Can teach"],
            ]
          }
        }
      ]
    }
  ],
}