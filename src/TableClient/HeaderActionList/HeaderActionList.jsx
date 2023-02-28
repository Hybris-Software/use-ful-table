import React, { useState } from "react";

//Components
import ConditionalComponent from "../ConditionalComponent/ConditionalComponent";

//Icon
import { BiDotsVerticalRounded } from "react-icons/bi";

// Styles
import Style from "./HeaderActionList.module.css";

function HeaderActionList({ column, tableRef, setHiddenColumns, texts }) {
	const [showActionList, setShowActionList] = useState(false);

	return (
		<div>
			<BiDotsVerticalRounded
				onClick={() => setShowActionList(!showActionList)}
				className={Style.headerActions}
				size={"20"}
			/>
			<ConditionalComponent condition={showActionList}>
				<div className={Style.boxAction}
					onMouseLeave={() => setShowActionList(false)}
				>
					<div className={Style.columnActions}>
						<ConditionalComponent condition={column.sortable !== false}>
							<div
								onClick={() => {
									const columnName = column.orderField || column.field;
									tableRef.current.setSortingSettings(columnName);
								}}
							>
								{texts.columnByAsc}
							</div>
						</ConditionalComponent>
						<ConditionalComponent condition={column.sortable !== false}>
							<div
								onClick={() => {
									const columnName = column.orderField || column.field;
									tableRef.current.setSortingSettings("-" + columnName);
								}}
							>
								{texts.columnByDesc}
							</div>
						</ConditionalComponent>

						<div
							onClick={() => {
								setHiddenColumns((oldState) => [...oldState, column.field]);
							}}
						>
							{texts.hideColumn}
						</div>
						<div
							onClick={() => {
								setHiddenColumns([]);
							}}
						>
							{texts.showColumns}
						</div>
					</div>
				</div>
			</ConditionalComponent>
		</div>
	);
}

export default HeaderActionList;
