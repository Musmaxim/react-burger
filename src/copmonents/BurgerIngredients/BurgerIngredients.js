import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import IngredientCard from "../IngredientCard/IngredientCard";

import styles from "./BurgerIngredients.module.css";

import { categories, getСategory } from "../../utils/navigate";

const BurgerIngredients = () => {
  const [tab, setTab] = useState(categories[0].title);

  const location = useLocation();

  const { ingredients } = useSelector((store) => store.ingredients);
  const data = useMemo(() => getСategory(ingredients), [ingredients]);

  const categoriesRef = useRef();

  const handleScroll = (e) => {
    const parentTop = categoriesRef.current.getBoundingClientRect().top;
    const startDiff = Math.abs(
      e.currentTarget.children[0].getBoundingClientRect().top - parentTop
    );

    const { index } = Array.from(e.currentTarget.children).reduce(
      (prev, curr, index) => {
        const diff = Math.abs(parentTop - curr.getBoundingClientRect().top);
        return diff < prev.diff ? { diff, index } : prev;
      },
      { diff: startDiff, index: 0 }
    );

    setTab(data[index].title);
  };

  const tabsRef = useRef([]);
  useEffect(() => {
    tabsRef.current[
      categories.findIndex((nextTab) => nextTab.title === tab)
    ].scrollIntoView();
  }, [tab, tabsRef]);

  return (
    <section className={styles.container + " mr-5"}>
      <p className={styles.title + " text text_type_main-medium mt-10 mb-5"}>
        Соберите бургер
      </p>
      <div className={styles.tabs}>
        {categories.map((category) => (
          <Tab
            key={category.type}
            value={category.title}
            active={tab === category.title}
            onClick={setTab}
          >
            {category.title}
          </Tab>
        ))}
      </div>
      <div
        ref={categoriesRef}
        className={styles.categories}
        onScroll={handleScroll}
      >
        {data &&
          data.map((category, index) => (
            <div
              ref={(node) => (tabsRef.current[index] = node)}
              key={category.type}
              className={styles.category}
            >
              <p className="text text_type_main-default mt-10">
                {category.title}
              </p>
              <div className={styles.ingredients}>
                {category.data.map((ingredient) => (
                  <Link
                    to={`/ingredients/${ingredient._id}`}
                    state={{ background: location }}
                    key={ingredient._id}
                    className={styles.link}
                  >
                    <IngredientCard key={ingredient._id} data={ingredient} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default BurgerIngredients;
