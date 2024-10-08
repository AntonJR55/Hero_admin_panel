import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import store from "../../store";
import { selectAll } from "../heroesFilters/filtersSlice";
import { heroCreated } from "../heroesList/heroesSlice";
import { useHttp } from "../../hooks/http.hook";

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState("");
    const [heroDescr, setHeroDescr] = useState("");
    const [heroElem, setHeroElem] = useState("");

    const filters = selectAll(store.getState());
    const filtersLoadingStatus = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const { request } = useHttp();

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescr,
            element: heroElem,
        };

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(dispatch(heroCreated(newHero)))
            .catch((err) => console.log(err));

        setHeroName("");
        setHeroDescr("");
        setHeroElem("");
    };

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>;
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>;
        }

        if (filters && filters.length > 0) {
            return filters.map(({ name, label }) => {
                // eslint-disable-next-line
                if (name === "all") return;

                return (
                    <option key={name} value={name}>
                        {label}
                    </option>
                );
            });
        }
    };

    return (
        <form
            className="border p-4 shadow-lg rounded"
            onSubmit={onSubmitHandler}
        >
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">
                    Имя нового героя
                </label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Как меня зовут?"
                    required
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">
                    Описание
                </label>
                <textarea
                    id="text"
                    name="text"
                    className="form-control"
                    placeholder="Что я умею?"
                    required
                    style={{ height: "130px" }}
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">
                    Выбрать элемент героя
                </label>
                <select
                    id="element"
                    name="element"
                    className="form-select"
                    required
                    value={heroElem}
                    onChange={(e) => setHeroElem(e.target.value)}
                >
                    <option>Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">
                Создать
            </button>
        </form>
    );
};

export default HeroesAddForm;
