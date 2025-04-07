"use client"; // Indique que ce composant doit être rendu côté client

// Import des hooks et bibliothèques nécessaires
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Search } from "lucide-react";

// Limite du nombre d'articles par page
const LIMIT = 15;

// Fonction utilitaire pour tronquer un texte si celui-ci dépasse une certaine longueur
const truncateText = (text, maxLength) => {
  if (!text) return "";
  // Si le texte est plus long que la longueur max, on le tronque et on ajoute " ..."
  return text.length > maxLength ? text.substring(0, maxLength) + " ..." : text;
};

// Fonction asynchrone pour récupérer les articles depuis l'API
const fetchArticles = async ({ page, limit, search, sortBy, order }) => {
  try {
    // Envoi d'une requête GET à l'API avec les paramètres de pagination, recherche et tri
    const res = await axios.get("http://localhost:4000/api/articles", {
      params: { page, limit, search, sortBy, order },
    });
    return res.data;
  } catch (err) {
    // En cas d'erreur, on affiche l'erreur dans la console et on retourne un objet vide
    console.error("Erreur de récupération des articles :", err);
    return { articles: [], total: 0, hasMore: false };
  }
};

// Composant principal de la page des articles
export default function ArticlesPage() {
  const router = useRouter(); // Hook pour la navigation Next.js

  // Déclarations des états du composant
  const [query, setQuery] = useState(""); // Etat pour la recherche en cours (input)
  const [search, setSearch] = useState(""); // Etat pour la recherche validée
  const [articles, setArticles] = useState([]); // Etat pour stocker les articles récupérés
  const [page, setPage] = useState(1); // Etat pour la page de pagination actuelle
  const [hasMore, setHasMore] = useState(true); // Etat pour savoir s'il y a encore des articles à charger
  const [total, setTotal] = useState(0); // Nombre total d'articles
  const [view, setView] = useState("grid"); // Etat pour la vue (grid ou table)
  const [sortBy, setSortBy] = useState("date"); // Critère de tri initial (par date)
  const [order, setOrder] = useState("desc"); // Ordre de tri initial (descendant)

  // Fonction pour charger les articles en fonction de la page actuelle
  const loadArticles = async (currentPage) => {
    const data = await fetchArticles({
      page: currentPage,
      limit: LIMIT,
      search,
      sortBy,
      order,
    });
    // Si on charge la première page, on remplace les articles, sinon on concatène
    if (currentPage === 1) {
      setArticles(data.articles);
    } else {
      setArticles((prev) => [...prev, ...data.articles]);
    }
    // Mise à jour des états de pagination et du total d'articles
    setHasMore(data.hasMore);
    setTotal(data.total);
  };

  // Chargement initial et lorsque les paramètres de recherche, tri ou ordre changent
  useEffect(() => {
    loadArticles(1);
  }, [search, sortBy, order]);

  // Recharge les articles quand la page change (pour la pagination infinie)
  useEffect(() => {
    loadArticles(page);
  }, [page]);

  // Gestion de l'événement de scroll pour la pagination infinie
  useEffect(() => {
    const handleScroll = () => {
      // Si l'utilisateur atteint presque le bas de la page et qu'il y a encore des articles...
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100 &&
        hasMore
      ) {
        // On passe à la page suivante
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Nettoyage de l'événement lors du démontage du composant
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  // Fonction de rappel pour changer l'ordre de tri en fonction du champ cliqué
  const toggleSort = useCallback(
    (field) => {
      if (sortBy === field) {
        // Si le tri est déjà sur ce champ, on inverse l'ordre
        setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
      } else {
        // Sinon, on change le critère de tri et on initialise l'ordre à ascendant
        setSortBy(field);
        setOrder("asc");
      }
      // Réinitialisation à la première page pour le nouveau tri
      setPage(1);
    },
    [sortBy]
  );

  // Gestion du changement de la valeur de l'input de recherche
  const handleChange = (e) => {
    setQuery(e.target.value); // Met à jour l'état de la recherche en cours
    debouncedSearch(e.target.value); // Déclenche la recherche avec debounce
  };

  // Soumission de la recherche : on met à jour l'état de la recherche validée et on réinitialise la page     handleSearchSubmit
  
  function debounce(func, timeout = 800) {
    let timer;
    return (...args) => {
     clearTimeout(timer);
     timer = setTimeout(() => {
      func.apply(this, args);
     }, timeout);
    };
  }


const debouncedSearch = useCallback(
  debounce((value) => {
    setSearch(value); 
    setPage(1); 
  }, 800),
  []
);
   
    function saveInput() {
      setSearch(query);
      setPage(1);
    } [query];
    
    const handleSearchSubmit = debounce(() => saveInput());

  



  // Fonction pour inverser l'ordre de tri par date et réinitialiser la page
  const toggleDateOrder = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortBy("date");
    setPage(1);
  };

  // Fonction pour inverser l'ordre de tri par auteur et réinitialiser la page
  const toggleAuthorOrder = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortBy("auteur");
    setPage(1);
  };


  
  return (
    <div className="relative min-h-screen bg-gray-900 text-white px-2 sm:px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-5xl mx-auto">
        {/* En-tête de la page avec le titre et la barre de recherche */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-2 sm:mb-0">
            Articles ({total})
          </h2>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Champ de recherche et bouton de soumission */}
            <div className="flex items-center gap-1">
              <Input
                className="bg-gray-800 text-white border-gray-600 placeholder:text-gray-400 w-40 sm:w-56"
                type="text"
                placeholder="Rechercher..."
                value={query}
                onChange={handleChange}
              />                                            
              <Button variant="outline" size="icon" onClick={handleSearchSubmit}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            {/* Boutons pour changer de vue (grid ou table) */}
            <Button variant="outline" size="icon" onClick={() => setView("grid")}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setView("table")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Affichage conditionnel selon la vue sélectionnée */}
        {view === "table" ? (
          // Vue en tableau pour afficher les articles
          <div className="w-full overflow-x-auto">
            <div className="rounded-lg bg-white text-black shadow-md">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-gray-800 text-white">
                  <TableRow>
                    {/* Colonne pour l'image */}
                    <TableHead className="p-1 text-center w-8 sm:w-16">
                      Image
                    </TableHead>
                    {/* Colonne pour le titre avec tri au clic */}
                    <TableHead
                      className="cursor-pointer p-1 text-center w-28 sm:w-56 break-words"
                      onClick={() => toggleSort("titre")}
                    >
                      Titre
                    </TableHead>
                    {/* Colonne pour la date avec un bouton pour inverser l'ordre */}
                    <TableHead className="cursor-pointer p-1 text-center w-16 sm:w-20 break-words">
                      <div className="flex items-center justify-center">
                        Date
                        <Button
                          variant="link"
                          className="ml-1 text-[10px] sm:text-xs"
                          onClick={toggleDateOrder}
                        >
                          {order === "asc" ? "▲" : "▼"}
                        </Button>
                      </div>
                    </TableHead>
                    {/* Colonne pour l'auteur avec un bouton pour inverser l'ordre */}
                    <TableHead className="cursor-pointer p-1 text-center w-16 sm:w-20 break-words">
                      <div className="flex items-center justify-center">
                        Auteur
                        <Button
                          variant="link"
                          className="ml-1 text-[10px] sm:text-xs"
                          onClick={toggleAuthorOrder}
                        >
                          {order === "asc" ? "▲" : "▼"}
                        </Button>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Si des articles existent, on les mappe dans le tableau */}
                  {articles.length > 0 ? (
                    articles.map((article) => (
                      <TableRow
                        key={article._id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                          router.push(`/deuxiemepage/${article._id}`)
                        }
                      >
                        {/* Affichage de l'image de l'article */}
                        <td className="p-1">
                          <img
                            src={`http://localhost:4000/api/articles/${article._id}/image`}
                            alt={article.titre}
                            className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-full"
                          />
                        </td>
                        {/* Affichage du titre avec un lien vers la page de détail */}
                        <td className="p-1 text-black hover:text-blue-500 break-words">
                          <span
                            onClick={(e) => {
                              e.stopPropagation(); // Empêche la propagation du clic vers le TableRow
                              router.push(`/deuxiemepage/${article._id}`);
                            }}
                            className="cursor-pointer hover:underline"
                          >
                            {truncateText(article.titre, 50)}
                          </span>
                        </td>
                        {/* Affichage de la date de l'article */}
                        <td className="p-1 text-center break-words">
                          {new Date(article.date).toLocaleDateString()}
                        </td>
                        {/* Affichage de l'auteur */}
                        <td className="p-1 text-center break-words">
                          {article.auteur}
                        </td>
                      </TableRow>
                    ))
                  ) : (
                    // Message affiché si aucun article n'est trouvé
                    <TableRow>
                      <td colSpan={4} className="p-1 text-center text-gray-500">
                        Aucun article trouvé
                      </td>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          // Vue en grille avec animations via framer-motion
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            {articles.length > 0 ? (
              articles.map((article) => (
                <motion.div
                  key={article._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl text-black"
                  onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Image de l'article */}
                  <img
                    src={`http://localhost:4000/api/articles/${article._id}/image`}
                    alt={article.titre}
                    className="w-full h-32 sm:h-40 object-cover"
                  />
                  <div className="p-2 sm:p-4">
                    {/* Titre de l'article */}
                    <h3 className="text-base sm:text-lg font-semibold mb-1">
                      {truncateText(article.titre, 50)}
                    </h3>
                    {/* Auteur de l'article */}
                    <p className="text-xs sm:text-sm text-gray-600">
                      {article.auteur}
                    </p>
                    {/* Extrait du contenu de l'article */}
                    <p className="text-xs sm:text-sm text-gray-500">
                      {truncateText(article.contenu, 100)}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              // Message affiché si aucun article n'est trouvé
              <p className="text-gray-400 text-center w-full">
                Aucun article trouvé.
              </p>
            )}
          </motion.div>
        )}

        {/* Bouton "Charger plus" pour charger la page suivante si d'autres articles sont disponibles */}
        {hasMore && (
          <div className="flex justify-center mt-4">
            <Button
              className="text-xs sm:text-sm"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Charger plus
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
