import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";

import store from "../../store/index";
import { activeFilterChanged, fetchFilters, selectAll } from "./filtersSlice";
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
    const { filtersLoadingStatus, activeFilter } = useSelector(
        (state) => state.filters
    );
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilters());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner />;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
    }

    const renderFilters = (filters) => {
        if (filters.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>;
        }

        return filters.map(({ name, label, className }) => {
            const btnClass = classNames("btn", className, {
                active: name === activeFilter,
            });

            return (
                <button
                    key={name}
                    id={name}
                    className={btnClass}
                    onClick={() => dispatch(activeFilterChanged(name))}
                >
                    {label}
                </button>
            );
        });
    };

    const elements = renderFilters(filters);

    return (
        <div className="card mt-4 shadow-lg">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">{elements}</div>
            </div>
        </div>
    );
};

export default HeroesFilters;
