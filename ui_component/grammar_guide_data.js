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
              ["寒い", "寒かった", "寒くない", "寒ければ"],
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
          list: [
            "綺麗な場所だ = It is a pretty place (Pretty place is)",
            "な adjectives can also function as nouns",
            "場所は綺麗だ = The place is pretty. (Place pretty is)",
            "な adjectives conjugate like nouns paired with the copula, so see **な adjective** conjugations for reference."
          ]
        }
      ]
    },
    {
      header: "Conjugating the Copula with **Nouns & な adjectives**",
      subheader: "Nouns and な adjectives conjugate with the copula だ as such.",
      content: [
        {
          list: [
            "だ (is) ー だった (was) ー じゃない (is not)",
            "猫だ (is a cat) ー 猫だった (was a cat) ー 猫じゃない (is not a cat)",
            "綺麗だ (is pretty) ー 綺麗だった (was pretty) ー 綺麗じゃない (is not pretty)",

          ]
        },
      ]
    },
    {
      header: "Particles",
      subheader: "Particles are used to indicate the relationship between words in a sentence. They are placed after the word they modify.",
      content: [
        {
          list: [
            "が - The subject marking particle (emphasis on what comes before)",
            "は - The topic marking particle (emphasis on what comes after. pronounced わ as a particle)",
            "を - The object marking particle",
            "に - When does it happen?",
            "で - Where does an action happen?",
            "と - The particle used to indicate a list of items or people",
            "から - The particle used to indicate the starting point of an action",
            "まで - The particle used to indicate the end point of an action",
            "より - The particle used to indicate a comparison",
            "へ - The particle used to indicate direction",
            "の -  The possession marking particle",
            "も - Also or Too",
            "か - Mark the unknown (make a statement a question)",
            "ね - The particle used to indicate agreement",
            "よ - The particle used to indicate emphasis",
          ]
        }
      ],
    },
    {
      header: 'App Categories',
      subheader: "",
      content: [
        {
          table:{
            headers: ["Category", "Hiragana", "Description"],
            rows: [
              ["名詞", "めいし", "Noun"],
              ["五段動詞", "ごだんどうし", "Godan verb (u)"],
              ["一段動詞", "いちだんどうし", "Ichidan(ru)"],
              ["不規則動詞", "ふきそくどうし", "Irregular"],
              ["い形容詞", "いけいようし", "I-adjective"],
              ["な形容詞", "なけいようし", "Na-adjective"],
              ["副詞", "ふくし", "Adverb"],
              ["助詞", "じょし", "Particle"],
              ["接続詞", "せつぞくし", "Conjunction"],
              ["感動詞", "かんどうし", "Interjection"],
              ["代名詞", "だいなことば", "Pronoun"],
              ["前置詞", "ぜんちし", "Preposition"],
              ["敬称", "けいしょう", "Honorific"],
              ["接尾詞", "せつびし", "Suffix"],
              ["数字", "すうじ", "Numeric(any number or counter)"],
            ]
          }
        }
      ],
    },
    {
      //todo: check for accuracy
      header:"Verb conjugations",
      subheader: "",
      content: [
        {
          table: {
            headers: ["Dictionary", "Past", "Negative", "Volitional", "Potential", "ている"],
            rows: [
              ["する","した", "しない", "しよう", "できる", "してる"],
              ["来る", "きた", "こない", "こよう", "こられる", "きてる"],
              ["買う", "買った", "買わない", "買おう", "買える", "買ってる"],
              ["教える", "教えた", "教えない", "教えよう", "教えられる", "教えてる"],
            ]
          }
        },
      ]
    },
    {
      header: "On'yomi and Kun'yomi",
      subheader: "",
      content: [
        {
          list: [
            "On'yomi - Two-kanji or more combinations",
            "Kun'yomi - Japanese readings of kanji",
            "Kanji can have multiple readings",
            "On'yomi readings are used in compound words",
            "Kun'yomi readings are used in standalone words"
          ]
        }
      ]
    },
  ],
}