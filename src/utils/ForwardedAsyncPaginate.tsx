import React from "react";
import { AsyncPaginate, AsyncPaginateProps } from "react-select-async-paginate";
import { GroupBase } from "react-select";

// Definição correta do tipo `OptionType`
type OptionType = { value: string; label: string };
type Additional = { page: number }; // Define `page` corretamente

const ForwardedAsyncPaginate = (props: AsyncPaginateProps<OptionType, GroupBase<OptionType>, Additional, false>) => {
    return <AsyncPaginate {...props} />;
};

export default ForwardedAsyncPaginate;
