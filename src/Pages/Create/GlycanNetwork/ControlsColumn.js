import React from "react";
import GlycanInput from "./GlycanInput";
import NetworkSettings from "./NetworkSettings";
import ActionControls from "./ActionControls";
import SelectedNodeDetails from "./SelectedNodeDetails";
import NetworkStatistics from "./NetworkStatistics";

const ControlsColumn = ({
  // Props for GlycanInput
  glycansInput,
  onGlycansInputChange,
  exampleGlycanSets,
  activeExample,
  onExampleClick,
  // Props for NetworkSettings
  showAdvanced,
  onToggleAdvanced,
  permittedRootsInput,
  onPermittedRootsInputChange,
  selectedEdgeType,
  onSelectedEdgeTypeChange,
  availableEdgeTypes,
  selectedPTMs,
  onTogglePTM,
  availablePTMs,
  // Props for ActionControls
  isLoading,
  onGenerateNetwork,
  onResetLayout,
  onExportPNG,
  canPerformActions,
  // Props for SelectedNodeDetails
  selectedNodeInfo,
  // Props for NetworkStatistics
  networkMetadata,
  // General
  isDarkMode,
}) => (
  <aside className="lg:col-span-4 space-y-6">
    <GlycanInput
      glycansInput={glycansInput}
      onInputChange={onGlycansInputChange}
      exampleGlycanSets={exampleGlycanSets}
      activeExample={activeExample}
      onExampleClick={onExampleClick}
      isDarkMode={isDarkMode}
    />
    <NetworkSettings
      showAdvanced={showAdvanced}
      onToggleAdvanced={onToggleAdvanced}
      permittedRootsInput={permittedRootsInput}
      onPermittedRootsInputChange={onPermittedRootsInputChange}
      selectedEdgeType={selectedEdgeType}
      onEdgeTypeChange={onSelectedEdgeTypeChange}
      availableEdgeTypes={availableEdgeTypes}
      selectedPTMs={selectedPTMs}
      onTogglePTM={onTogglePTM}
      availablePTMs={availablePTMs}
      isDarkMode={isDarkMode}
    />
    <ActionControls
      isLoading={isLoading}
      onGenerateNetwork={onGenerateNetwork}
      onResetLayout={onResetLayout}
      onExportPNG={onExportPNG}
      canPerformActions={canPerformActions}
    />
    <SelectedNodeDetails
      selectedNodeInfo={selectedNodeInfo}
      isDarkMode={isDarkMode}
    />
    <NetworkStatistics
      networkMetadata={networkMetadata}
      isDarkMode={isDarkMode}
    />
  </aside>
);

export default ControlsColumn;
