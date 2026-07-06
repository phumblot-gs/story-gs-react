import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Thumbnail } from "./Thumbnail";
import { MediaStatus } from "@/utils/mediaStatus";
import { Layout, HStack, VStack } from "@/components/layout";

const meta: Meta<typeof Thumbnail> = {
  title: "Components/Thumbnail",
  component: Thumbnail,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    picture_id: {
      control: "number",
      description: "ID de la photo. Si absent ou -1, affiche un thumbnail vide",
    },
    size: {
      control: "select",
      options: ["small", "large", "auto", "150px", "200px", "250px", "300px", "400px"],
      description:
        'Taille prédéfinie ("small", "large"), "auto" (prend toute la largeur disponible) ou personnalisée ("200px", "15rem", etc.)',
    },
    status: {
      control: "select",
      options: [
        undefined,
        MediaStatus.TO_RESHOOT,
        MediaStatus.SUBMITTED_FOR_APPROVAL,
        MediaStatus.VALIDATED,
        MediaStatus.SELECTED,
        MediaStatus.READY_TO_BROADCAST,
        MediaStatus.IGNORED,
        MediaStatus.REFUSED_1,
        MediaStatus.BROADCAST,
      ],
    },
    label: {
      control: "select",
      options: ["blue", "green", "orange", "pink", "purple", "red", "yellow", "white", "transparent"],
    },
    rating: {
      control: { type: "range", min: 0, max: 5, step: 1 },
    },
    isUrgent: {
      control: "boolean",
      description: "Affiche l'indicateur Urgent (badge orange)",
    },
    isAlert: {
      control: "boolean",
      description: "Affiche l'indicateur Alerte (badge rouge)",
    },
    isVedette: {
      control: "boolean",
      description: "Affiche l'indicateur Vedette (badge étoile)",
    },
    is360: {
      control: "boolean",
      description: "Affiche l'indicateur 360 (badge panoramique)",
    },
    view: {
      control: "text",
      description: "Code de vue du fichier (ex: F, B, L, R, T, D)",
    },
    imageBgColor: {
      control: "color",
      description: "Couleur de fond de l'image elle-même (content-box de l'<img>, utile pour les PNG transparents)",
    },
    viewportBgColor: {
      control: "color",
      description: "Couleur de fond du viewport (conteneur autour de l'image, y compris l'espace de letterboxing). Distinct de imageBgColor.",
    },
  },
  args: {
    onImageClick: fn(),
    onSelectionChange: fn(),
    onRatingChange: fn(),
    onLabelChange: fn(),
    onTagAdd: fn(),
    onTagRemove: fn(),
    onCommentAdd: fn(),
    onValidate: fn(),
    onReject: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample image URL
const sampleImageUrl = "https://picsum.photos/340/340";
const sampleImageUrl2 = "https://picsum.photos/341/341";
const sampleImageUrl3 = "https://picsum.photos/342/342";

/**
 * Default thumbnail with all features
 */
export const Default: Story = {
  args: {
    picture_id: 1,
    src: sampleImageUrl,
    alt: "Sample image",
    filename: "photo_2024_01_15_very_long_filename_that_should_truncate.jpg",
    rating: 3,
    label: "yellow",
    tags: { "product-shot": true, "hero-image": true },
    comments: [
      { comment: "Great shot!", type: "Comment", date_mod: "2024-01-15" },
    ],
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    view: "F",
  },
};

/**
 * Thumbnail with all different status values
 * Shows the MediaStatus bar at the bottom with different colors
 */
export const WithStatus: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <VStack gap={4}>
        <div className="text-sm font-medium mb-2">All Status Types:</div>
        <HStack gap={4} className="flex-wrap">
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={101}
              src={sampleImageUrl}
              filename="to_reshoot.jpg"
              status={MediaStatus.TO_RESHOOT}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">To Reshoot (5)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={102}
              src={sampleImageUrl}
              filename="for_approval.jpg"
              status={MediaStatus.SUBMITTED_FOR_APPROVAL}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">For Approval (40)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={103}
              src={sampleImageUrl}
              filename="validated.jpg"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Validated (50)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={104}
              src={sampleImageUrl}
              filename="selected.jpg"
              status={MediaStatus.SELECTED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Selected (30)</span>
          </VStack>
        </HStack>
        <HStack gap={4} className="flex-wrap">
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={105}
              src={sampleImageUrl}
              filename="ready_to_broadcast.jpg"
              status={MediaStatus.READY_TO_BROADCAST}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Ready to Broadcast (51)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={106}
              src={sampleImageUrl}
              filename="ignored.jpg"
              status={MediaStatus.IGNORED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Ignored (1)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={107}
              src={sampleImageUrl}
              filename="refused.jpg"
              status={MediaStatus.REFUSED_1}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Refused (31)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={108}
              src={sampleImageUrl}
              filename="broadcast.jpg"
              status={MediaStatus.BROADCAST}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Broadcast (55)</span>
          </VStack>
        </HStack>
        <HStack gap={4} className="flex-wrap">
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={109}
              src={sampleImageUrl}
              filename="not_selected.jpg"
              status={MediaStatus.NOT_SELECTED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Not Selected (10)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={110}
              src={sampleImageUrl}
              filename="error.jpg"
              status={MediaStatus.ERROR_DURING_BROADCAST}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Error (52)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={111}
              src={sampleImageUrl}
              filename="archived.jpg"
              status={MediaStatus.ARCHIVED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Archived (80)</span>
          </VStack>
        </HStack>
      </VStack>
    </Layout>
  ),
};

/**
 * Thumbnail with all indicators
 */
export const WithIndicators: Story = {
  args: {
    picture_id: 2,
    src: sampleImageUrl,
    filename: "urgent_photo.jpg",
    rating: 5,
    label: "red",
    status: MediaStatus.TO_RESHOOT,
    isUrgent: true,
    isAlert: true,
    isVedette: true,
    is360: true,
    view: "B",
  },
};

/**
 * Selected thumbnail
 */
export const Selected: Story = {
  args: {
    picture_id: 3,
    src: sampleImageUrl,
    filename: "selected_photo.jpg",
    selected: true,
    rating: 4,
    label: "green",
    status: MediaStatus.VALIDATED,
    view: "F",
  },
};

/**
 * Small size thumbnail
 */
export const SmallSize: Story = {
  args: {
    picture_id: 4,
    src: sampleImageUrl,
    filename: "small_photo.jpg",
    size: "small",
    rating: 2,
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    view: "L",
  },
};

/**
 * Custom size thumbnails
 * You can pass any CSS size value like "400px", "200px", "15rem", etc.
 */
export const CustomSize: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <VStack gap={4}>
        <div className="text-sm font-medium mb-2">Custom Sizes:</div>
        <HStack gap={4} className="flex-wrap items-end">
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={201}
              src={sampleImageUrl}
              filename="custom_150px.jpg"
              size="150px"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">150px</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={202}
              src={sampleImageUrl}
              filename="custom_200px.jpg"
              size="200px"
              status={MediaStatus.SUBMITTED_FOR_APPROVAL}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">200px</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={203}
              src={sampleImageUrl}
              filename="custom_250px.jpg"
              size="250px"
              status={MediaStatus.SELECTED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">250px</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={204}
              src={sampleImageUrl}
              filename="custom_400px.jpg"
              size="400px"
              status={MediaStatus.BROADCAST}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">400px</span>
          </VStack>
        </HStack>
      </VStack>
    </Layout>
  ),
};

/**
 * Auto size thumbnail
 * Le composant prend toute la largeur disponible de son conteneur.
 * L'image conserve son ratio (object-contain) et pilote sa propre hauteur.
 */
export const AutoSize: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <VStack gap={4}>
        <div className="text-sm font-medium mb-2">
          Auto size (largeur = espace disponible) :
        </div>
        {/* Conteneur de largeur variable pour illustrer le remplissage */}
        <div style={{ width: 500, maxWidth: "100%" }}>
          <Thumbnail
            picture_id={601}
            src={sampleImageUrl}
            filename="auto_500px_container.jpg"
            size="auto"
            rating={3}
            status={MediaStatus.SUBMITTED_FOR_APPROVAL}
            view="F"
            onSelectionChange={fn()}
            onRatingChange={fn()}
            onLabelChange={fn()}
          />
        </div>
        <div style={{ width: 260 }}>
          <Thumbnail
            picture_id={602}
            src={sampleImageUrl2}
            filename="auto_260px_container.jpg"
            size="auto"
            rating={4}
            status={MediaStatus.VALIDATED}
            view="B"
            onSelectionChange={fn()}
            onRatingChange={fn()}
            onLabelChange={fn()}
          />
        </div>
      </VStack>
    </Layout>
  ),
};

/**
 * Auto size dans une grille responsive
 * Chaque thumbnail remplit sa cellule de grille.
 */
export const AutoSizeGrid: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <div
        style={{
          width: 640,
          maxWidth: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Thumbnail
            key={i}
            picture_id={700 + i}
            src={`https://picsum.photos/300/300?random=${i}`}
            filename={`auto_${i.toString().padStart(3, "0")}.jpg`}
            size="auto"
            rating={i % 6}
            status={MediaStatus.SUBMITTED_FOR_APPROVAL}
            view={["F", "B", "L", "R", "T", "D"][i - 1]}
            onSelectionChange={fn()}
            onRatingChange={fn()}
            onLabelChange={fn()}
          />
        ))}
      </div>
    </Layout>
  ),
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    picture_id: 8,
    filename: "loading_photo.jpg",
    isLoading: true,
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
  },
};

/**
 * Error state (broken/corrupted image)
 * Shows the BrokenFile icon when an image fails to load
 */
export const Error: Story = {
  args: {
    picture_id: 9,
    filename: "missing_photo.jpg",
    hasError: true,
    status: MediaStatus.REFUSED_1,
  },
};

/**
 * With custom actions
 */
export const WithActions: Story = {
  args: {
    picture_id: 5,
    src: sampleImageUrl,
    filename: "photo_with_actions.jpg",
    rating: 3,
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    actions: [
      { key: "download", label: "Télécharger", action: () => console.log("Download") },
      { key: "edit", label: "Modifier", action: () => console.log("Edit") },
      { key: "delete", label: "Supprimer", action: () => console.log("Delete"), disabled: true },
      { key: "share", label: "Partager", action: () => console.log("Share") },
    ],
    view: "F",
  },
};

/**
 * Without validation buttons
 */
export const WithoutValidation: Story = {
  args: {
    picture_id: 6,
    src: sampleImageUrl,
    filename: "no_validation_photo.jpg",
    rating: 2,
    status: MediaStatus.BROADCAST,
    onValidate: undefined,
    onReject: undefined,
    view: "F",
  },
};

/**
 * Read-only (no callbacks)
 */
export const ReadOnly: Story = {
  args: {
    picture_id: 7,
    src: sampleImageUrl,
    filename: "readonly_photo.jpg",
    rating: 4,
    label: "blue",
    status: MediaStatus.SELECTED,
    onImageClick: undefined,
    onSelectionChange: undefined,
    onRatingChange: undefined,
    onLabelChange: undefined,
    onTagAdd: undefined,
    onTagRemove: undefined,
    onCommentAdd: undefined,
    onValidate: undefined,
    onReject: undefined,
    view: "R",
  },
};

/**
 * Grid of thumbnails
 */
export const ThumbnailGrid: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <HStack gap={4} className="flex-wrap">
        <Thumbnail
          picture_id={301}
          src={sampleImageUrl}
          filename="photo_001.jpg"
          rating={3}
          status={MediaStatus.SUBMITTED_FOR_APPROVAL}
          onSelectionChange={fn()}
          onRatingChange={fn()}
          onLabelChange={fn()}
          view="F"
        />
        <Thumbnail
          picture_id={302}
          src={sampleImageUrl2}
          filename="photo_002.jpg"
          rating={5}
          selected
          status={MediaStatus.VALIDATED}
          onSelectionChange={fn()}
          onRatingChange={fn()}
          onLabelChange={fn()}
          isVedette
          view="B"
        />
        <Thumbnail
          picture_id={303}
          src={sampleImageUrl3}
          filename="photo_003.jpg"
          rating={1}
          status={MediaStatus.REFUSED_1}
          onSelectionChange={fn()}
          onRatingChange={fn()}
          onLabelChange={fn()}
          isAlert
          view="L"
        />
      </HStack>
    </Layout>
  ),
};

/**
 * Small thumbnails grid
 */
export const SmallThumbnailGrid: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <HStack gap={2} className="flex-wrap">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Thumbnail
            key={i}
            picture_id={i}
            src={`https://picsum.photos/100/100?random=${i}`}
            filename={`photo_${i.toString().padStart(3, "0")}.jpg`}
            size="small"
            rating={i % 6}
            status={
              i % 3 === 0
                ? MediaStatus.VALIDATED
                : i % 3 === 1
                ? MediaStatus.SUBMITTED_FOR_APPROVAL
                : MediaStatus.REFUSED_1
            }
            onSelectionChange={fn()}
            onRatingChange={fn()}
            onLabelChange={fn()}
            onValidate={undefined}
            onReject={undefined}
            view={["F", "B", "L", "R", "T", "D"][i - 1]}
          />
        ))}
      </HStack>
    </Layout>
  ),
};

/**
 * Empty thumbnail (without picture_id)
 * Shows a simple grey placeholder
 */
export const Empty: Story = {
  args: {
    // No picture_id = empty thumbnail
    size: "large",
  },
};

/**
 * Empty thumbnail with view indicator
 * Shows a question mark background with the view indicator
 */
export const EmptyWithView: Story = {
  args: {
    // No picture_id = empty thumbnail
    view: "F",
    size: "large",
  },
};

/**
 * Empty thumbnails grid - showing different views
 */
export const EmptyThumbnailGrid: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <VStack gap={4}>
        <div className="text-sm font-medium mb-2">Empty Thumbnails with Views:</div>
        <HStack gap={4} className="flex-wrap">
          <VStack gap={1} align="center">
            <Thumbnail size="large" />
            <span className="text-xs">No view</span>
          </VStack>
          {["F", "B", "L", "R", "T", "D"].map((v) => (
            <VStack key={v} gap={1} align="center">
              <Thumbnail view={v} size="large" />
              <span className="text-xs">View: {v}</span>
            </VStack>
          ))}
        </HStack>
        <div className="text-sm font-medium mb-2 mt-4">Small Empty Thumbnails:</div>
        <HStack gap={2} className="flex-wrap">
          <VStack gap={1} align="center">
            <Thumbnail size="small" />
            <span className="text-xs">No view</span>
          </VStack>
          {["F", "B", "L", "R"].map((v) => (
            <VStack key={v} gap={1} align="center">
              <Thumbnail view={v} size="small" />
              <span className="text-xs">View: {v}</span>
            </VStack>
          ))}
        </HStack>
      </VStack>
    </Layout>
  ),
};

/**
 * Thumbnail with background color for transparent images (PNG)
 * Shows how imageBgColor can be used to set a background behind transparent images
 */
export const WithImageBackground: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <VStack gap={4}>
        <div className="text-sm font-medium mb-2">Image Background Color (for transparent PNGs):</div>
        <HStack gap={4} className="flex-wrap items-start">
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={401}
              src={sampleImageUrl}
              filename="no_background.jpg"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Sans fond</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={402}
              src={sampleImageUrl}
              filename="white_background.png"
              imageBgColor="#ffffff"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Fond blanc</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={403}
              src={sampleImageUrl}
              filename="grey_background.png"
              imageBgColor="#f0f0f0"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Fond gris clair</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={404}
              src={sampleImageUrl}
              filename="black_background.png"
              imageBgColor="#000000"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Fond noir</span>
          </VStack>
        </HStack>
        <HStack gap={4} className="flex-wrap items-start">
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={405}
              src={sampleImageUrl}
              filename="blue_background.png"
              imageBgColor="#e3f2fd"
              status={MediaStatus.SUBMITTED_FOR_APPROVAL}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Fond bleu clair</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={406}
              src={sampleImageUrl}
              filename="pink_background.png"
              imageBgColor="#fce4ec"
              size="small"
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Small + fond rose</span>
          </VStack>
        </HStack>
      </VStack>
    </Layout>
  ),
};

/**
 * Thumbnail avec couleur de fond du viewport (viewportBgColor)
 *
 * `viewportBgColor` colore tout le conteneur d'affichage (letterboxing compris),
 * contrairement à `imageBgColor` qui ne colore que la box de l'image.
 * Reproduit la palette du raccourci `D` de l'app zoom.
 */
export const WithViewportBackground: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <VStack gap={4}>
        <div className="text-sm font-medium mb-2">
          Viewport Background Color (palette du raccourci D) :
        </div>
        <HStack gap={4} className="flex-wrap items-start">
          {[
            { color: "#FFFFFF", label: "#FFFFFF" },
            { color: "#D0D0D0", label: "#D0D0D0" },
            { color: "#777777", label: "#777777" },
            { color: "#333333", label: "#333333" },
          ].map(({ color, label }, i) => (
            <VStack key={color} gap={1} align="center">
              <Thumbnail
                picture_id={501 + i}
                src={sampleImageUrl}
                filename={`viewport_${label}.jpg`}
                viewportBgColor={color}
                status={MediaStatus.VALIDATED}
                onSelectionChange={fn()}
                onValidate={undefined}
                onReject={undefined}
              />
              <span className="text-xs">{label}</span>
            </VStack>
          ))}
        </HStack>
        <div className="text-sm font-medium mb-2 mt-4">
          Distinction imageBgColor (fond de l'image) vs viewportBgColor (fond du conteneur) :
        </div>
        <HStack gap={4} className="flex-wrap items-start">
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={510}
              src={sampleImageUrl}
              filename="image_bg_only.jpg"
              imageBgColor="#e3f2fd"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">imageBgColor seul</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={511}
              src={sampleImageUrl}
              filename="viewport_bg_only.jpg"
              viewportBgColor="#777777"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">viewportBgColor seul</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              picture_id={512}
              src={sampleImageUrl}
              filename="both.png"
              imageBgColor="#e3f2fd"
              viewportBgColor="#333333"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Les deux</span>
          </VStack>
        </HStack>
      </VStack>
    </Layout>
  ),
};

// Bench avec rejection options pour les stories
const benchWithRejectionOptions = {
  config: {
    validation: {
      rejection_options: {
        active: true,
        main: ["refus main 1", "refus main2"],
        secondary: ["refus secondaire 1", "refus secondaire 2"],
      },
    },
  },
};

export const WithRejectionOptions: Story = {
  render: () => (
    <Layout bg="white" padding={4}>
      <HStack gap={4}>
        <VStack gap={2} className="items-center">
          <Thumbnail
            picture_id={1}
            src={sampleImageUrl}
            filename="photo_avec_refus.jpg"
            status={MediaStatus.SUBMITTED_FOR_APPROVAL}
            rating={3}
            label="green"
            size="large"
            bench={benchWithRejectionOptions}
            onValidate={fn()}
            onReject={(msg) => console.log("Reject:", msg)}
            onRatingChange={fn()}
            onLabelChange={fn()}
            onSelectionChange={fn()}
          />
          <span className="text-xs">Large - avec options de refus</span>
        </VStack>
        <VStack gap={2} className="items-center">
          <Thumbnail
            picture_id={2}
            src={sampleImageUrl2}
            filename="photo_sans_refus.jpg"
            status={MediaStatus.SUBMITTED_FOR_APPROVAL}
            rating={2}
            size="large"
            onValidate={fn()}
            onReject={(msg) => console.log("Reject:", msg)}
            onRatingChange={fn()}
            onLabelChange={fn()}
            onSelectionChange={fn()}
          />
          <span className="text-xs">Large - sans options de refus</span>
        </VStack>
      </HStack>
    </Layout>
  ),
};
