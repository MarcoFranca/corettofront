import React from "react";
import { Dropdown, Button, Tooltip } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { MenuProps } from "antd";
import { Cliente } from "@/types/interfaces";

interface TableActionsProps {
    record: Cliente;
    actionMenu: (record: Cliente) => any[]; // array de itens
}

export const TableActions: React.FC<TableActionsProps> = ({
                                                              record,
                                                              actionMenu,
                                                          }) => {
    // Mapeia os items para o padrão do antd Menu
    const items: MenuProps["items"] = actionMenu(record).map((item: any) => ({
        key: item.key,
        label: (
            <span
                style={{
                    color: item.danger ? "#d4380d" : undefined,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}
                onClick={e => {
                    e.stopPropagation();
                    if (item.onClick) item.onClick();
                }}
            >
                {item.icon}
                {item.label}
            </span>
        ),
        danger: item.danger,
    }));

    return (
        <Dropdown menu={{ items }} trigger={["hover"]}>
            <Button
                icon={<BsThreeDotsVertical size={18} />}
            />
        </Dropdown>
    );
};
