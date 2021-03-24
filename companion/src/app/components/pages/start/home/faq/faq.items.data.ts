export type ItemData = { question: string, answer: string };
export const faqItems: ItemData[] = [
  {
    question: 'Was kostet das?',
    answer: 'Nichts, die Anwendung ist kostenlos.',
  },
  {
    question: 'Wer erhält meine Daten?',
    answer: 'Die Daten werden von Alexa und der Web-Anwendung auf Servern von Amazon gespeichert. Von dort werden sie aber nicht abgegriffen. Termine sind Privatsache und sollen das auch bleiben.',
  },
  {
    question: 'Wie hilft mir der Sprachassistent im Alltag?',
    answer: 'Der Sprachassistent hilft rechtzeitig Termine wahrzunehmen. Dabei hilft die Steuerung per Sprache eine natürliche und Intuitive Interaktion zu schaffen.',
  },
  {
    question: 'Warum ist Termin Helfer besser als bisherige Apps?',
    answer: 'Weil Termin Helfer alle Punkte an einem zentralen Punkt vereint.'
  },
  {
    question: 'Was passiert im Falle eines Stromausfalls?',
    answer: 'Ein Stromausfall ist ärgerlich, denn so kann Alexa keine Erinnerungen mehr senden. Durch die Webanwendung bleiben jedoch alle Termine am Handy oder Laptop zugänglich.'
  },
  {
    question: 'Was wenn ich kein Echo-Device habe?',
    answer: 'Der Skill kann auch am Handy in der Alexa App genutzt werden. Die Web-Anwendung ist unabhängig von allen Echo Geräten und kann an allen Computern, Tablets und Smartphones mit Internetzugang genutzt werden.'
  }
];
