"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Header,
  BackButton,
  SearchBar,
  CategoryList,
  RestaurantInfo,
  TableIndicator,
  CategoryListSkeleton,
  Skeleton,
} from "@/components";
import {
  restaurantsRetrieve,
  restaurantsMenuCategoriesList,
  tablesValidateRetrieve,
} from "@/api/generated/api";
import { useTable } from "@/context/TableContext";
import type {
  RestaurantDetail,
  MenuCategory,
} from "@/api/generated/interfaces";
import styles from "./page.module.css";

export default function RestaurantDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const tableCode = searchParams.get("table");

  const { tableData, setTableData, setTableCode: storeTableCode } = useTable();

  const [searchQuery, setSearchQuery] = useState("");
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle table code from QR scan
  useEffect(() => {
    async function handleTableCode() {
      if (tableCode && (!tableData || tableData.code !== tableCode)) {
        try {
          const validationResult = await tablesValidateRetrieve(tableCode);
          setTableData({
            code: tableCode,
            tableNumber: validationResult.table_number,
            tableName: validationResult.table_name,
            restaurantSlug: validationResult.restaurant_slug,
            sessionId: validationResult.session_id,
            isValidated: true,
          });
        } catch (err) {
          console.error("Failed to validate table code:", err);
          // Store the code anyway but mark as not validated
          storeTableCode(tableCode);
        }
      }
    }

    if (tableCode) {
      handleTableCode();
    }
  }, [tableCode, tableData, setTableData, storeTableCode]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [restaurantData, categoriesData] = await Promise.all([
          restaurantsRetrieve(slug),
          restaurantsMenuCategoriesList(slug),
        ]);
        setRestaurant(restaurantData);
        setCategories(categoriesData.results);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch restaurant data:", err);
        setError("ვერ მოხერხდა რესტორნის ჩატვირთვა");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const getTranslatedName = (translations: unknown): string => {
    if (!translations) return "";

    // Handle object with nested language structure: { ka: { name: "..." }, en: { name: "..." } }
    if (typeof translations === "object") {
      const obj = translations as Record<string, { name?: string } | string>;
      const kaValue = obj.ka;
      const enValue = obj.en;

      // Check if it's nested structure with name property
      if (kaValue && typeof kaValue === "object" && "name" in kaValue) {
        return kaValue.name || "";
      }
      if (enValue && typeof enValue === "object" && "name" in enValue) {
        return enValue.name || "";
      }

      // Fallback to first available language
      const firstValue = Object.values(obj)[0];
      if (
        firstValue &&
        typeof firstValue === "object" &&
        "name" in firstValue
      ) {
        return firstValue.name || "";
      }

      // Simple structure: { ka: "name", en: "name" }
      if (typeof kaValue === "string") return kaValue;
      if (typeof enValue === "string") return enValue;
    }

    if (typeof translations === "string") {
      try {
        return getTranslatedName(JSON.parse(translations));
      } catch {
        return translations;
      }
    }

    return "";
  };

  const formattedCategories = categories.map((cat) => ({
    id: cat.id,
    name: getTranslatedName(cat.translations),
    image: cat.image,
  }));

  const filteredCategories = formattedCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.titleSection}>
            <BackButton />
            <h1 className={styles.pageTitle}>მენიუ</h1>
          </div>

          <div className={styles.restaurantInfoSkeleton}>
            <Skeleton className={styles.logoSkeleton} />
            <div className={styles.infoSkeleton}>
              <Skeleton className={styles.nameSkeleton} />
              <Skeleton className={styles.descSkeleton} />
            </div>
          </div>

          <div className={styles.searchSection}>
            <Skeleton className={styles.searchSkeleton} />
          </div>

          <div className={styles.categoriesSection}>
            <div className={styles.categoriesList}>
              <CategoryListSkeleton count={6} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.errorState}>
            {error || "რესტორანი ვერ მოიძებნა"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <BackButton />
          <h1 className={styles.pageTitle}>მენიუ</h1>
        </div>

        <RestaurantInfo
          name={restaurant.name}
          description={`${restaurant.city || "თბილისი"} • ${restaurant.description || "ქართული სამზარეულო"}`}
          logo={restaurant.logo}
          rating={parseFloat(restaurant.average_rating || "0")}
        />

        <div className={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="მოძებნე კერძი სახელით"
          />
        </div>

        <div className={styles.categoriesSection}>
          <CategoryList categories={filteredCategories} restaurantSlug={slug} />
        </div>
      </main>

      <TableIndicator />
    </div>
  );
}
