<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
        <v-btn
            v-bind="activatorProps"
            color="FFFFFF"
            icon
            size="x-large"
        >
            <v-icon>
            mdi-account-multiple-outline
            </v-icon>
        </v-btn>
        </template>

        <template v-slot:default="{ isActive }">

        <v-card color="secondary">
            <v-row justify="center">
            <v-col>
                <v-card-title class="my-1 font-weight-bold bg-secondary" style="font-size: 1.4rem;">
                <v-icon start icon="mdi-account-multiple-outline"></v-icon>
                Amigos
                </v-card-title>
            </v-col>
            <v-col align="end">
                
                <v-btn
                class="mr-1 mt-1"
                icon
                color="secondary"
                @click="isActive.value = false"
                size="medium"
                elevation="0"
                >
                <v-icon>
                mdi-close
                </v-icon>
            </v-btn>
            </v-col>

            </v-row>
            <v-card class="mx-2 mb-3">
                <v-tabs
                    v-model="tab"
                    bg-color=""
                    >
                    <v-tab value="one">Amigos</v-tab>
                    <v-tab value="two">Solicitudes</v-tab>
                    </v-tabs>

                    <v-card-text>
                    <v-tabs-window v-model="tab">
                        <v-tabs-window-item value="one">
                        One
                        </v-tabs-window-item>

                        <v-tabs-window-item value="two">
                        Two
                        </v-tabs-window-item>
                    </v-tabs-window>
                    </v-card-text>
            </v-card>



        </v-card>
        </template>
    </v-dialog>
</template>

<script>
export default {
    name: 'FriendsDialog',
}
</script>
