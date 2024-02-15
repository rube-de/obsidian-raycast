import { Action, ActionPanel, getPreferenceValues, List, open, popToRoot, closeMainWindow } from "@raycast/api";

import { getObsidianTarget, ObsidianTargetType, useObsidianVaults, vaultPluginCheck } from "./utils/utils";
import { NoVaultFoundMessage } from "./components/Notifications/NoVaultFoundMessage";
import { NoteFormPreferences } from "./utils/preferences";
import { vaultsWithoutAdvancedURIToast } from "./components/Toasts";
import AdvancedURIPluginNotInstalled from "./components/Notifications/AdvancedURIPluginNotInstalled";

export default function Command() {
  const { vaults, ready } = useObsidianVaults();
  const pref = getPreferenceValues<NoteFormPreferences>();

  if (!ready) {
    return <List isLoading={true}></List>;
  } else if (vaults.length === 0) {
    return <NoVaultFoundMessage />;
  } 
  
  const [vaultsWithPlugin, vaultsWithoutPlugin] = vaultPluginCheck(vaults, "obsidian-advanced-uri");
  if (vaultsWithoutPlugin.length > 0) {
    vaultsWithoutAdvancedURIToast(vaultsWithoutPlugin);
  }
  if (vaultsWithPlugin.length == 0) {
    return <AdvancedURIPluginNotInstalled />;
  }

  if (vaultsWithPlugin.length == 1) {
    const target = getObsidianTarget({ type: ObsidianTargetType.QuickAdd, vault: vaultsWithPlugin[0] });
    open(target);
    popToRoot();
    closeMainWindow();
  }

  return (
    <List isLoading={vaultsWithPlugin === undefined}>
      {vaultsWithPlugin?.map((vault) => (
        <List.Item
          title={vault.name}
          key={vault.key}
          actions={
            <ActionPanel>
              <Action.Open
                title="QuickAdd"
                target={getObsidianTarget({ type: ObsidianTargetType.QuickAdd, vault: vault })}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
