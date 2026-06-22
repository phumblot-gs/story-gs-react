import React, { useRef, useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Layout, VStack } from "@/components/layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TruncatedText } from "@/components/ui/truncated-text";
import { ButtonThumbnailStars } from "@/components/ui/button-thumbnail-stars";
import { ButtonThumbnailLabels, type LabelColor } from "@/components/ui/button-thumbnail-labels";
import { ButtonThumbnailTags } from "@/components/ui/button-thumbnail-tags";
import { ButtonThumbnailComments } from "@/components/ui/button-thumbnail-comments";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ButtonStatus } from "@/components/ButtonStatus";
import MediaStatus from "@/components/MediaStatus";
import { MediaStatus as MediaStatusEnum } from "@/utils/mediaStatus";
import type { TagsData } from "@/components/ui/button-thumbnail-tags";
import type { CommentData } from "@/components/ui/button-thumbnail-comments";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useTranslationSafe, type TranslationMap } from "@/contexts/TranslationContext";

/** Configuration de rejet du bench */
export interface BenchRejectionOptions {
  active?: boolean;
  main?: string[];
  secondary?: string[];
}

/** Structure minimale du bench nécessaire pour le Thumbnail */
export interface ThumbnailBench {
  config?: {
    validation?: {
      rejection_options?: BenchRejectionOptions;
    };
  };
}
import { UrgentIndicator } from "./UrgentIndicator";
import { AlertIndicator } from "./AlertIndicator";
import { VedetteIndicator } from "./VedetteIndicator";
import { Three60Indicator } from "./Three60Indicator";
import { ViewIndicator } from "./ViewIndicator";

/** Tailles prédéfinies du thumbnail */
export type ThumbnailPresetSize = "small" | "large";

/**
 * Taille du thumbnail:
 * - "small" (100px) ou "large" (340px) pour les tailles prédéfinies
 * - Une valeur CSS personnalisée comme "400px", "200px", "15rem", etc.
 */
export type ThumbnailSize = ThumbnailPresetSize | (string & {});

export interface ThumbnailAction {
  /** Clé unique de l'action */
  key: string;
  /** Label affiché dans le menu */
  label: string;
  /** Callback appelé lors du clic */
  action: () => void;
  /** Désactive l'action */
  disabled?: boolean;
}

export interface ThumbnailProps {
  // Image data
  /** ID de la photo */
  picture_id?: number;
  /** URL de l'image thumbnail */
  src?: string;
  /** Texte alternatif de l'image */
  alt?: string;
  /** Nom du fichier à afficher */
  filename?: string;
  /** Indique si le fichier est urgent */
  isUrgent?: boolean;
  /** Indicateur d'alerte */
  isAlert?: boolean;
  /** Indicateur de vedette */
  isVedette?: boolean;
  /** Indicateur de 360 */
  is360?: boolean;
  /** Code de vue du fichier */
  view?: string;

  // Overlay images (master/format)
  /** URL de l'image master à superposer */
  masterSrc?: string;
  /** URL de l'image format à superposer */
  formatSrc?: string;

  // Status
  /** Statut du média (pour la barre de couleur en bas) */
  status?: MediaStatusEnum;

  // Rating, Label, Tags, Comments
  /** Note (0-5 étoiles) */
  rating?: number;
  /** Couleur du label */
  label?: LabelColor;
  /** Tags associés */
  tags?: TagsData;
  /** Commentaires associés */
  comments?: CommentData[];
  /** Indique si le fichier a des annotations */
  hasAnnotations?: boolean;

  // Image appearance
  /**
   * Couleur de fond de l'image.
   * Utile pour les images avec transparence (PNG).
   * Accepte toute valeur CSS valide (ex: "#ffffff", "rgb(255,255,255)", "white").
   */
  imageBgColor?: string;

  // Selection
  /** Indique si le thumbnail est sélectionné */
  selected?: boolean;

  // Appearance
  /**
   * Taille du thumbnail:
   * - "small" (100px) ou "large" (340px) pour les tailles prédéfinies
   * - Une valeur CSS personnalisée comme "400px", "200px", "15rem", etc.
   */
  size?: ThumbnailSize;
  /** Classes CSS additionnelles */
  className?: string;

  // Actions
  /** Actions disponibles dans le menu dropdown */
  actions?: ThumbnailAction[];
  /** Nombre maximum d'actions affichées dans le dropdown */
  maxDropdownItems?: number;

  // Loading states
  /** État de chargement de l'image */
  isLoading?: boolean;
  /** Erreur de chargement de l'image */
  hasError?: boolean;

  // Callbacks
  /** Callback appelé lors du clic sur l'image (zoom) */
  onImageClick?: () => void;
  /** Callback appelé lors de la sélection/désélection */
  onSelectionChange?: (selected: boolean, event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) => void;
  /** Callback de chargement réussi de l'image */
  onImageLoad?: () => void;
  /** Callback d'erreur de chargement de l'image */
  onImageError?: () => void;
  /** Callback de changement de note */
  onRatingChange?: (rating: number) => void;
  /** Callback de changement de label/couleur */
  onLabelChange?: (color: LabelColor) => void;
  /** Callback d'ajout de tag */
  onTagAdd?: (tag: string) => void;
  /** Callback de suppression de tag */
  onTagRemove?: (tag: string) => void;
  /** Callback d'ajout de commentaire */
  onCommentAdd?: (comment: string) => Promise<void>;
  /** Callback de validation */
  onValidate?: () => void;
  /** Callback de rejet. Si rejection_options actif, reçoit le message de refus choisi. */
  onReject?: (rejectionMessage?: string) => void;
  /** Données du bench pour les options de rejet */
  bench?: ThumbnailBench;

  // Drag and drop
  /** Indique si le drag and drop est activé */
  draggable?: boolean;
  /** Callback de début de drag */
  onDragStart?: (event: React.DragEvent) => void;
  /** Callback de survol pendant le drag */
  onDragOver?: (event: React.DragEvent) => void;
  /** Callback de drop */
  onDrop?: (event: React.DragEvent) => void;
  /** Callback de sortie de zone de drag */
  onDragLeave?: () => void;
  /** Indique si ce thumbnail est en train d'être dragué */
  isDragged?: boolean;
  /** Indique si ce thumbnail est survolé pendant un drag */
  isDragOver?: boolean;

  // Translation props (optional - works without TranslationProvider)
  /** Code de langue (ex: "fr", "en", "es", "it", "de") */
  language?: string;
  /** Traductions personnalisées pour surcharger les valeurs par défaut */
  translations?: Partial<TranslationMap>;
}

/**
 * Composant Thumbnail pour afficher et gérer les fichiers/images
 *
 * Composant de présentation qui affiche une image avec ses métadonnées et interactions.
 * Toute la logique métier (API calls, validation, etc.) est gérée par l'application parente
 * via les callbacks.
 *
 * @example
 * <Thumbnail
 *   src="/images/photo.jpg"
 *   filename="photo.jpg"
 *   rating={3}
 *   label="#FFD600"
 *   selected={isSelected}
 *   onSelectionChange={(selected) => setIsSelected(selected)}
 *   onRatingChange={(rating) => updateRating(rating)}
 * />
 */
export const Thumbnail: React.FC<ThumbnailProps> = ({
  // Image data
  picture_id,
  src,
  alt = "",
  filename = "",
  isUrgent = false,
  isAlert = false,
  isVedette = false,
  is360 = false,

  // Overlay images
  masterSrc,
  formatSrc,

  // Status
  status,

  // Rating, Label, Tags, Comments
  rating = 0,
  label = "yellow",
  tags = {},
  comments = [],
  hasAnnotations = false,

  // Image appearance
  imageBgColor,

  // Selection
  selected = false,

  // Appearance
  size = "large",
  className,

  // Actions
  actions,
  maxDropdownItems = 10,

  view,

  // Loading states
  isLoading = false,
  hasError = false,

  // Callbacks
  onImageClick,
  onSelectionChange,
  onImageLoad,
  onImageError,
  onRatingChange,
  onLabelChange,
  onTagAdd,
  onTagRemove,
  onCommentAdd,
  onValidate,
  onReject,
  bench,

  // Drag and drop
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragLeave,
  isDragged = false,
  isDragOver = false,
  language,
  translations,
}) => {
  const { t } = useTranslationSafe(translations, language);

  // Ref pour capturer l'événement de clic (pour shiftKey, etc.)
  const clickEventRef = useRef<React.PointerEvent | null>(null);

  // État pour gérer les menus mutuellement exclusifs
  type MenuId = "stars" | "labels" | "tags" | "comments" | "actions" | "reject" | null;
  const [openMenu, setOpenMenu] = useState<MenuId>(null);

  // État pour la vue du menu de rejet (main ou secondary)
  const [rejectMenuView, setRejectMenuView] = useState<"main" | "secondary">("main");

  // Options de rejet du bench
  const rejectionOptions = bench?.config?.validation?.rejection_options;
  const hasRejectionMenu = !!(
    rejectionOptions?.active &&
    ((rejectionOptions.main && rejectionOptions.main.length > 0) ||
      (rejectionOptions.secondary && rejectionOptions.secondary.length > 0))
  );

  // Handler pour gérer l'ouverture/fermeture des menus
  const handleMenuOpenChange = useCallback((menuId: MenuId, open: boolean) => {
    setOpenMenu(open ? menuId : null);
  }, []);

  // Calcul de la configuration de taille (prédéfinie ou personnalisée)
  const config = useMemo(() => {
    // Configurations prédéfinies
    if (size === "large") {
      return {
        containerWidth: "340px",
        imageMinHeight: "340px",
        imageMaxHeight: "340px",
        iconSize: 40,
        isSmall: false,
      };
    }

    if (size === "small") {
      return {
        containerWidth: "100px",
        imageMinHeight: "100px",
        imageMaxHeight: "100px",
        iconSize: 20,
        isSmall: true,
      };
    }

    // Taille personnalisée (ex: "400px", "200px", "15rem")
    // Extraire la valeur numérique pour déterminer si c'est "petit" (< 150px)
    const numericValue = parseInt(size, 10);
    const isSmallSize = !isNaN(numericValue) && numericValue < 150;

    return {
      containerWidth: size,
      imageMinHeight: size,
      imageMaxHeight: size,
      iconSize: isSmallSize ? 20 : 40,
      isSmall: isSmallSize,
    };
  }, [size]);

  // Handler pour le drag
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (onDragStart) {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(e);
      }
    },
    [onDragStart]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (onDragOver) {
        e.preventDefault();
        onDragOver(e);
      }
    },
    [onDragOver]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (onDrop) {
        e.preventDefault();
        onDrop(e);
      }
    },
    [onDrop]
  );

  const handleDragEnd = useCallback(() => {
    if (onDragLeave) {
      onDragLeave();
    }
  }, [onDragLeave]);

  // Handler pour la sélection
  const handleSelectionChange = useCallback(
    (checked: boolean) => {
      if (onSelectionChange) {
        const clickEvent = clickEventRef.current;
        onSelectionChange(checked, {
          shiftKey: clickEvent?.shiftKey || false,
          ctrlKey: clickEvent?.ctrlKey || false,
          metaKey: clickEvent?.metaKey || false,
        });
        clickEventRef.current = null;
      }
    },
    [onSelectionChange]
  );

  // Wrapper classes
  const wrapperClasses = cn(
    "flex flex-col items-center w-full mx-auto h-[fill-available]",
    isDragged && "opacity-40 cursor-grabbing scale-95 transition-all duration-200",
    "border-[1px] border-dashed rounded-sm bg-primary/10 transition-all duration-200",
    isDragOver ? "border-grey-stronger" : "border-transparent",
    draggable && "cursor-grab hover:opacity-90 transition-all duration-200",
    (!picture_id || picture_id === -1) && 'item-image-wrapper-empty-view',
    className
  );

  // Container classes (sans les dimensions qui seront en inline)
  const containerClasses = cn(
    "relative flex items-center justify-center border-[0.25px] border-white",
    (!picture_id || picture_id === -1) && view ? ' bg-grey-middle' : 'bg-white'
  );

  return (
    <div
      className={wrapperClasses}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragEnd}
      onDragEnd={handleDragEnd}
    >
      <Layout
        bg="white"
        className="flex flex-col items-stretch flex-1 rounded-sm"
        style={{ width: config.containerWidth, minWidth: config.isSmall ? config.containerWidth : undefined }}
      >
        {/* Image container */}
        <div
          className={containerClasses}
          style={{ minHeight: (!picture_id || picture_id === -1) && view ? "100%" : config.imageMinHeight }}
        >
          {/* Master overlay */}
          {picture_id &&masterSrc && (
            <div className="absolute inset-0 z-10 opacity-50">
              <img src={masterSrc} alt="Master" className="w-full h-full object-contain" />
            </div>
          )}

          {/* Format overlay */}
          {picture_id && formatSrc && (
            <div className="absolute inset-0 z-10">
              <img src={formatSrc} alt="Format" className="w-full h-full object-contain" />
            </div>
          )}

          {/* Loading spinner */}
          {picture_id && isLoading && !hasError && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 border-4 border-grey-light border-t-grey-strongest rounded-full animate-spin" />
            </div>
          )}

          {/* Shadow layer with hover effects */}
          {!isLoading && picture_id && (
            <div
              className={cn(
                "absolute inset-0 z-10 bg-black/0 transition-colors cursor-pointer",
                "hover:bg-black/80",
                "[&:hover_.search-icon]:opacity-100",
                "[&:hover_.thumbnail-checkbox:not([data-state=checked])]:opacity-100",
                selected && "[&_.thumbnail-checkbox]:opacity-100"
              )}
              onClick={onImageClick}
            >
              {/* Checkbox */}
              {onSelectionChange && (
                <div
                  className={`${size === "small" ? "ml-1 mt-1" : "ml-2 mt-2"} inline-flex`}
                  onPointerDown={(e) => {
                    clickEventRef.current = e;
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selected}
                    onCheckedChange={handleSelectionChange}
                    className={cn(
                      "thumbnail-checkbox transition-opacity",
                      !selected && "opacity-0"
                    )}
                  />
                </div>
              )}

              {/* Search icon */}
              <span className="search-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity">
                <Icon name="Plus" strokeWidth={2} size={size === "small" ? 7 : 12} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${size === "small" ? "ml-[-1px]" : "ml-[-2px]"} ${size === "small" ? "mt-[-4px]" : "mt-[-5px]"}`} />
                <Icon name="Search" size={config.iconSize} strokeWidth={1} />
              </span>
            </div>
          )}

          {/* Main image */}
          {!hasError && src && (
            <img
              src={src}
              alt={alt}
              onError={onImageError}
              onLoad={onImageLoad}
              className="object-contain block mx-auto max-w-full border-[0.25px] border-grey-light"
              style={{
                maxHeight: config.imageMaxHeight,
                backgroundColor: imageBgColor,
              }}
            />
          )}
          {hasError && src && (
            <div
              className="w-full flex items-center justify-center bg-grey-middle"
              style={{ minHeight: config.imageMinHeight }}
            >
              <Icon name="BrokenFile" size={20} className="text-white" />
            </div>
          )}
          {(!picture_id || picture_id === -1) && view && (
            <div
              className="flex items-center justify-center w-full"
              style={{ minHeight: config.imageMinHeight }}
            >
              <Icon name="EmptyFile" size={30} className="text-white" />
            </div>
          )}

          {/* Left indicators */}
          {(isUrgent || isAlert || isVedette || is360) && (
            <VStack
              className={cn(
                `absolute ${size === "small" ? "top-1 left-1" : "top-2 left-2"} transition-opacity`,
                (selected || isDragOver) && "opacity-0"
              )}
              gap={1}
            >
              {isUrgent && <UrgentIndicator />}
              {isAlert && <AlertIndicator />}
              {isVedette && <VedetteIndicator />}
              {is360 && <Three60Indicator />}
            </VStack>
          )}

          {/* Right indicators */}
          <VStack className={`absolute ${size === "small" ? "top-1 right-1" : "top-2 right-2"}`} gap={0}>
            <ViewIndicator view={view} />
          </VStack>
        </div>

        {/* Footer */}
        {((picture_id && picture_id !== -1) || !view) && (
          <Layout
            bg={selected ? "black" : "white"}
            className="flex flex-col p-0 gap-0 w-full min-h-0 flex-shrink-0 transition-colors"
            >
            {/* Filename row */}
            <div className="w-full text-center px-1 pt-1">
              <TruncatedText
                text={filename}
                className={cn(
                  "text-sm cursor-pointer",
                  selected && "text-white"
                )}
              />
            </div>

            {/* Actions row */}
            <div className="flex items-center justify-end gap-1 px-1 pb-2 pt-1 w-full">
              {picture_id && onRatingChange && (
                <ButtonThumbnailStars
                  value={rating}
                  variant="secondary"
                  onClick={onRatingChange}
                  size="small"
                  compact={size === "small"}
                  className="p-0 w-4 h-4"
                  menuSide="top"
                  menuAlign={size === "small" ? "start" : "end"}
                  menuBgContext="white"
                  open={openMenu === "stars"}
                  onOpenChange={(open) => handleMenuOpenChange("stars", open)}
                />
              )}

              {picture_id && onLabelChange && (
                <ButtonThumbnailLabels
                  value={label}
                  variant="secondary"
                  onClick={onLabelChange}
                  size="small"
                  compact={size === "small"}
                  className="p-0 w-4 h-4"
                  menuSide="top"
                  menuAlign={size === "small" ? "start" : "end"}
                  menuBgContext="white"
                  open={openMenu === "labels"}
                  onOpenChange={(open) => handleMenuOpenChange("labels", open)}
                />
              )}

              {picture_id && (onTagAdd || onTagRemove) && (
                <ButtonThumbnailTags
                  variant="secondary"
                  value={tags}
                  onAddTag={onTagAdd}
                  onRemoveTag={onTagRemove}
                  size="small"
                  className="p-0 w-4 h-4"
                  menuSide="top"
                  menuAlign="end"
                  menuBgContext="white"
                  open={openMenu === "tags"}
                  onOpenChange={(open) => handleMenuOpenChange("tags", open)}
                />
              )}

              {picture_id && onCommentAdd && (
                <ButtonThumbnailComments
                  value={comments}
                  hasAnnotations={hasAnnotations}
                  variant="secondary"
                  size="small"
                  onAddComment={onCommentAdd}
                  className="p-0 w-4 h-4"
                  menuSide="top"
                  menuAlign="end"
                  menuBgContext="white"
                  open={openMenu === "comments"}
                  onOpenChange={(open) => handleMenuOpenChange("comments", open)}
                />
              )}

              {picture_id && actions && actions.length > 0 && (
                <DropdownMenu
                  open={openMenu === "actions"}
                  onOpenChange={(open) => handleMenuOpenChange("actions", open)}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="p-0 w-6 h-6"
                      size="medium"
                      variant="secondary"
                    >
                      <span className="text-lg leading-none">...</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {actions.length === 0 ? (
                      <DropdownMenuItem disabled>{t("thumbnail.noActions")}</DropdownMenuItem>
                    ) : (
                      <>
                        {actions.slice(0, maxDropdownItems).map((action) => (
                          <DropdownMenuItem
                            key={action.key}
                            onClick={action.action}
                            disabled={action.disabled}
                          >
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                        {actions.length > maxDropdownItems && (
                          <DropdownMenuItem disabled>
                            {t("thumbnail.moreActions", { count: actions.length - maxDropdownItems })}
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </Layout>
        )}

        {/* Status bar */}
        {picture_id && status !== undefined && (
          <MediaStatus
            status={status}
            className="flex-shrink-0"
            width="full"
            height={3}
          />
        )}
      </Layout>

      {/* Validation/Rejection buttons */}
      {(onValidate || onReject) && (
        <div
          className="flex justify-center items-center gap-2 min-h-[40px] py-2"
          style={{ width: config.containerWidth }}
        >
          {picture_id && onReject && !hasRejectionMenu && (
            <ButtonStatus
              icon="X"
              isActive={status === 31 || status === 35}
              status={31}
              size="small"
              disabled={status === 31 || status === 35}
              onClick={() => onReject()}
            />
          )}
          {picture_id && onReject && hasRejectionMenu && (
            <Popover
              open={openMenu === "reject"}
              onOpenChange={(open) => {
                handleMenuOpenChange("reject", open);
                if (!open) setRejectMenuView("main");
              }}
            >
              <PopoverTrigger asChild>
                <span>
                  <ButtonStatus
                    icon="X"
                    isActive={status === 31 || status === 35}
                    status={31}
                    size="small"
                    disabled={status === 31 || status === 35}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuOpenChange("reject", openMenu !== "reject");
                    }}
                  />
                </span>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-auto min-w-[200px] max-w-[280px] rounded-sm border-0 bg-black p-0"
              >
                {rejectMenuView === "main" ? (
                  <VStack gap={0} padding={0}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 pt-3 pb-2">
                      <span className="text-sm font-medium text-white">{t("thumbnail.chooseReason")}</span>
                      <button
                        type="button"
                        className="text-white hover:text-grey-lighter transition-colors p-0.5"
                        onClick={() => handleMenuOpenChange("reject", false)}
                      >
                        <Icon name="X" size={10} strokeWidth={1} />
                      </button>
                    </div>
                    {/* Main options */}
                    {rejectionOptions?.main?.map((reason, index) => (
                      <button
                        key={`main-${index}`}
                        type="button"
                        className="w-full px-3 py-1.5 text-left text-sm text-white hover:bg-white/10 transition-colors"
                        onClick={() => {
                          onReject(reason);
                          handleMenuOpenChange("reject", false);
                          setRejectMenuView("main");
                        }}
                      >
                        {reason}
                      </button>
                    ))}
                    {/* Link to secondary options */}
                    {rejectionOptions?.secondary && rejectionOptions.secondary.length > 0 && (
                      <>
                        <div className="mx-3 border-t border-white/20" />
                        <button
                          type="button"
                          className="w-full px-3 py-1.5 flex items-center justify-between text-sm text-grey-lighter hover:bg-white/10 transition-colors"
                          onClick={() => setRejectMenuView("secondary")}
                        >
                          <span>{t("thumbnail.otherReason")}</span>
                          <Icon name="ChevronRight" size={14} strokeWidth={2} />
                        </button>
                      </>
                    )}
                  </VStack>
                ) : (
                  <VStack gap={0} padding={0}>
                    {/* Header with back button */}
                    <div className="flex items-center justify-between px-3 pt-3 pb-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-white hover:text-grey-lighter transition-colors p-0.5"
                          onClick={() => setRejectMenuView("main")}
                        >
                          <Icon name="ChevronLeft" size={14} strokeWidth={2} />
                        </button>
                        <span className="text-sm font-medium text-white">{t("thumbnail.chooseReason")}</span>
                      </div>
                      <button
                        type="button"
                        className="text-white hover:text-grey-lighter transition-colors p-0.5"
                        onClick={() => {
                          handleMenuOpenChange("reject", false);
                          setRejectMenuView("main");
                        }}
                      >
                        <Icon name="X" size={10} strokeWidth={1} />
                      </button>
                    </div>
                    {/* Secondary options */}
                    {rejectionOptions?.secondary?.map((reason, index) => (
                      <button
                        key={`secondary-${index}`}
                        type="button"
                        className="w-full px-3 py-1.5 text-left text-sm text-white hover:bg-white/10 transition-colors"
                        onClick={() => {
                          onReject(reason);
                          handleMenuOpenChange("reject", false);
                          setRejectMenuView("main");
                        }}
                      >
                        {reason}
                      </button>
                    ))}
                  </VStack>
                )}
              </PopoverContent>
            </Popover>
          )}
          {picture_id && onValidate && (
            <ButtonStatus
              icon="Check"
              isActive={status === 50}
              status={50}
              size="small"
              disabled={status === 50}
              onClick={onValidate}
            />  
          )}
        </div>
      )}
    </div>
  );
};

Thumbnail.displayName = "Thumbnail";
