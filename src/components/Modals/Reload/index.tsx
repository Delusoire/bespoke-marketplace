import { t } from "https://esm.sh/i18next";
import Button from "../../Button.js";
import { S } from "/modules/Delusoire/std/index.js";
import { hide } from "/modules/Delusoire/std/api/modal.js";

export default function () {
	return (
		<div id="marketplace-reload-container">
			<p>{t("reloadModal.description")}</p>
			<div className="marketplace-reload-modal__button-container">
				<Button
					onClick={() => {
						location.reload();
					}}
				>
					{t("reloadModal.reloadNow")}
				</Button>
				<Button
					onClick={() => {
						hide();
					}}
				>
					{t("reloadModal.reloadLater")}
				</Button>
			</div>
		</div>
	);
}
