/** The site assistant. Structure lives in ChatWidget.tsx; every word is here. */
export const chat = {
  open: "Poser une question",
  close: "Fermer",
  title: "Demander à Deev",
  subtitle: "Des réponses sur nos réalisations, nos services et l'aide de 70 %.",
  greeting:
    "Posez-moi vos questions sur ce que Deev construit, sur les projets que nous avons livrés ou sur le fonctionnement de l'aide aux PME luxembourgeoises. Pour une vraie demande, le formulaire de contact va plus vite.",
  placeholder: "Écrivez votre question",
  send: "Envoyer",
  stop: "Arrêter",
  clear: "Effacer cette conversation",
  thinking: "Écriture",
  suggestions: [
    "Que construit Deev ?",
    "Comment fonctionne l'aide de 70 % ?",
    "Montrez-moi une application web",
  ],
  notice:
    "Les réponses sont générées par IA et peuvent être inexactes. N'écrivez pas de données personnelles ou confidentielles.",
  noticeLink: "Ce que nous en faisons",
  errors: {
    busy: "Trop de questions à la fois. Réessayez dans un instant.",
    upstream: "Un problème est survenu de notre côté. Réessayez ou écrivez à contact@deev.lu.",
    offline: "Pas de connexion. Vérifiez votre réseau et réessayez.",
    limited: "Cela fait beaucoup de questions. Faites une pause ou écrivez à contact@deev.lu.",
    refused: "Je préfère ne pas répondre à celle-là. Posez-moi une question sur Deev.",
    unavailable: "L'assistant n'est pas disponible pour le moment. Écrivez à contact@deev.lu et nous vous répondrons.",
  },
};
