"use client";

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
import { ArrowUpDown, LayoutGrid, List } from "lucide-react";

const fetchArticles = async ({ page, limit, search, sortBy, order }) => {
  try {
    const res = await axios.get("http://localhost:4000/api/articles", {
      params: { page, limit, search, sortBy, order },
    });
    return res.data;
  } catch (err) {
    console.error("Erreur de récupération des articles :", err);
    return { articles: [], total: 0, hasMore: false };
  }
};

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");
  const limit = 15; // Pagination de 15 articles par appel

  const loadArticles = async (currentPage) => {
    const data = await fetchArticles({ page: currentPage, limit, search, sortBy, order });
    if (currentPage === 1) setArticles(data.articles);
    else setArticles((prev) => [...prev, ...data.articles]);
    setHasMore(data.hasMore);
    setTotal(data.total);
  };

  useEffect(() => {
    loadArticles(1);
  }, [search, sortBy, order]);

  useEffect(() => {
    loadArticles(page);
  }, [page]);

  // Scroll infini - déclenche quand on est proche du bas de la page
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100 &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore]);

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            Articles ({total})
          </h2>
          <div className="flex gap-2 items-center">
            <Input
              className="bg-gray-800 text-white border-gray-600 placeholder:text-gray-400"
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={handleSearch}
            />
            <Button variant="outline" size="icon" onClick={() => setView("grid")}>
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setView("table")}>
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {view === "table" ? (
          <div className="overflow-x-auto rounded-xl bg-white text-black shadow-md">
            <Table>
              <TableHeader className="bg-gray-800 text-white">
                <TableRow>
                  <TableHead className="p-3 font-semibold text-center">Image</TableHead>
                  <TableHead
                    className="cursor-pointer p-3 font-semibold text-center"
                    onClick={() => toggleSort("titre")}
                  >
                    Titre <ArrowUpDown className="inline w-4 h-4" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer p-3 font-semibold text-center"
                    onClick={() => toggleSort("date")}
                  >
                    Date <ArrowUpDown className="inline w-4 h-4" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer p-3 font-semibold text-center"
                    onClick={() => toggleSort("auteur")}
                  >
                    Auteur <ArrowUpDown className="inline w-4 h-4" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles?.length > 0 ? (
                  articles.map((article) => (
                    <TableRow
                      key={article._id}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td
                        onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                        className="p-3"
                      >
                        <img
                          src={`http://localhost:4000${article.image}`}
                          alt=""
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      </td>
                      <td
                        onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                        className="p-3 truncate"
                      >
                        {article.titre}
                      </td>
                      <td
                        onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                        className="p-3 text-center"
                      >
                        {new Date(article.date).toLocaleDateString()}
                      </td>
                      <td
                        onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                        className="p-3 text-center"
                      >
                        {article.auteur}
                      </td>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td colSpan={4} className="text-center text-gray-500">
                      Aucun article trouvé
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            {articles?.length > 0 ? (
              articles.map((article) => (
                <motion.div
                  key={article._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl text-black"
                  onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={`http://localhost:4000${article.image}`}
                    alt={article.titre}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{article.titre}</h3>
                    <p className="text-sm text-gray-600">{article.auteur}</p>
                    <p className="text-sm text-gray-500 truncate">{article.contenu}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">Aucun article trouvé.</p>
            )}
          </motion.div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-10">
            <Button onClick={() => setPage((p) => p + 1)}>Charger plus</Button>
          </div>
        )}
      </div>
    </div>
  );
}
