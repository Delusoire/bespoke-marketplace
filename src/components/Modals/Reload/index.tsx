import { t } from "https://esm.sh/i18next";
import Button from "../../Button.js";
import { S } from "/modules/Delusoire/std/index.js";

const ReloadModal = () => {
	return (
		<div id="marketplace-reload-container">
			<p>{t("reloadModal.description")}</p>
			<div className="marketplace-reload-modal__button-container">
				<Button
					onClick={() => {
						Spicetify.PopupModal.hide();
						location.reload();
					}}
				>
					{t("reloadModal.reloadNow")}
				</Button>
				<Button
					onClick={() => {
						Spicetify.PopupModal.hide();
					}}
				>
					{t("reloadModal.reloadLater")}
				</Button>
			</div>
		</div>
	);
};

export default ReloadModal;
